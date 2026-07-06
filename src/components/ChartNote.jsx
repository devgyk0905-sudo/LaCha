import { useState, useRef, useEffect, useCallback } from 'react'
import { useTheme } from '../App'
import { supabase } from '../lib/supabase'

/* ── 이미지 확대 모달 ── */
function ImageZoomModal({ src, onClose }) {
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(null)
  const lastTouches = useRef(null)
  const imgRef = useRef()

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    setScale(prev => Math.min(5, Math.max(1, prev - e.deltaY * 0.002)))
  }, [])

  const handleMouseDown = (e) => {
    if (scale <= 1) return
    setDragging(true)
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
  }
  const handleMouseMove = (e) => {
    if (!dragging) return
    setPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
  }
  const handleMouseUp = () => setDragging(false)

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) lastTouches.current = e.touches
  }
  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastTouches.current) {
      e.preventDefault()
      const prev = lastTouches.current
      const prevDist = Math.hypot(prev[0].clientX - prev[1].clientX, prev[0].clientY - prev[1].clientY)
      const currDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
      setScale(prev => Math.min(5, Math.max(1, prev * (currDist / prevDist))))
      lastTouches.current = e.touches
    }
  }

  const handleDoubleClick = () => { setScale(1); setPos({ x: 0, y: 0 }) }

  useEffect(() => {
    const el = imgRef.current?.parentElement
    if (el) el.addEventListener('wheel', handleWheel, { passive: false })
    return () => { if (el) el.removeEventListener('wheel', handleWheel) }
  }, [handleWheel])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.9)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center text-sm hover:bg-white/20 z-10"
      >✕</button>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs">
        휠·핀치로 확대 · 더블클릭으로 초기화 · 확대 시 드래그 이동
      </p>
      <div
        ref={imgRef}
        className="overflow-hidden"
        style={{ width: '90vw', height: '90vh', cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          style={{
            width: '100%', height: '100%', objectFit: 'contain',
            transform: `scale(${scale}) translate(${pos.x / scale}px, ${pos.y / scale}px)`,
            transformOrigin: 'center',
            transition: dragging ? 'none' : 'transform 0.1s',
            userSelect: 'none',
          }}
        />
      </div>
    </div>
  )
}

export default function ChartNote({ page, section, label = '추가 이미지' }) {
  const { dark, user } = useTheme()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [zoomSrc, setZoomSrc] = useState(null)
  const inputRef = useRef()

  const borderC = dark ? 'border-white/15' : 'border-black/15'
  const bgC     = dark ? 'bg-[#1a1e2a]'   : 'bg-gray-50'
  const muted   = dark ? 'text-[#7a7f94]' : 'text-gray-400'
  const cardBg  = dark ? 'bg-[#1a1e2a] border-white/10' : 'bg-gray-50 border-black/10'
  const inputC  = dark
    ? 'bg-[#0d0f14] border-white/10 text-[#e8eaf0] placeholder-[#7a7f94]'
    : 'bg-white border-black/10 text-[#1a1e2a] placeholder-gray-400'

  useEffect(() => { fetchRecords() }, [page, section])

  async function fetchRecords() {
    setLoading(true)
    const { data, error } = await supabase
      .from('chart_notes')
      .select('*')
      .eq('page', page)
      .eq('section', section)
      .order('sort_order', { ascending: true })
    if (!error && data) setRecords(data)
    setLoading(false)
  }

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file || !user) return
    setUploading(true)

    const ext = file.name.split('.').pop().toLowerCase()
    const fileName = `${page}/${section}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('chart-images')
      .upload(fileName, file)

    if (uploadError) { setUploading(false); return }

    const { data: urlData } = supabase.storage
      .from('chart-images')
      .getPublicUrl(fileName)

    const maxOrder = records.length > 0 ? Math.max(...records.map(r => r.sort_order || 0)) : -1

    await supabase.from('chart_notes').insert({
      page,
      section,
      image_url: urlData.publicUrl,
      note: '',
      sort_order: maxOrder + 1,
      user_id: user.id,
    })

    await fetchRecords()
    setUploading(false)
    e.target.value = ''
  }

  async function handleNoteChange(id, note) {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, note } : r))
  }

  async function handleNoteBlur(id, note) {
    await supabase
      .from('chart_notes')
      .update({ note, updated_at: new Date().toISOString() })
      .eq('id', id)
  }

  async function handleDelete(id, image_url) {
    if (!user) return
    if (image_url) {
      const path = image_url.split('/chart-images/')[1]
      if (path) await supabase.storage.from('chart-images').remove([path])
    }
    await supabase.from('chart_notes').delete().eq('id', id)
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  async function handleMove(index, direction) {
    if (!user) return
    const newRecords = [...records]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= newRecords.length) return
    const temp = newRecords[index]
    newRecords[index] = newRecords[targetIndex]
    newRecords[targetIndex] = temp
    const updated = newRecords.map((r, i) => ({ ...r, sort_order: i }))
    setRecords(updated)
    await Promise.all([
      supabase.from('chart_notes').update({ sort_order: updated[index].sort_order }).eq('id', updated[index].id),
      supabase.from('chart_notes').update({ sort_order: updated[targetIndex].sort_order }).eq('id', updated[targetIndex].id),
    ])
  }

  return (
    <>
      <div className="mt-4">
        <p className="text-xs font-semibold mb-2">{label}</p>

        {loading ? (
          <p className={`text-xs ${muted}`}>불러오는 중...</p>
        ) : (
          <>
            {records.length > 0 && (
              <div className="space-y-2 mb-3">
                {records.map((record, index) => (
                  <div key={record.id} className={`rounded-xl border overflow-hidden ${cardBg}`}>
                    <div className="relative">
                      <img
                        src={record.image_url}
                        alt=""
                        className="w-full object-contain cursor-zoom-in"
                        style={{ maxHeight: '320px' }}
                        onClick={() => setZoomSrc(record.image_url)}
                      />
                      {/* 삭제 버튼 — 로그인 시에만 */}
                      {user && (
                        <button
                          onClick={() => handleDelete(record.id, record.image_url)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white text-xs flex items-center justify-center hover:bg-black/70 transition-colors"
                        >✕</button>
                      )}
                      {/* 순서 버튼 — 로그인 시에만 */}
                      {user && records.length > 1 && (
                        <div className="absolute bottom-2 right-2 flex flex-col gap-1">
                          <button
                            onClick={() => handleMove(index, -1)}
                            disabled={index === 0}
                            className="w-7 h-7 rounded-md bg-black/45 text-white text-sm flex items-center justify-center transition-opacity"
                            style={{ opacity: index === 0 ? 0.3 : 1 }}
                          >↑</button>
                          <button
                            onClick={() => handleMove(index, 1)}
                            disabled={index === records.length - 1}
                            className="w-7 h-7 rounded-md bg-black/45 text-white text-sm flex items-center justify-center transition-opacity"
                            style={{ opacity: index === records.length - 1 ? 0.3 : 1 }}
                          >↓</button>
                        </div>
                      )}
                    </div>
                    {/* 노트 — 로그인 시 편집 가능, 비로그인 시 읽기 전용 */}
                    <textarea
                      value={record.note || ''}
                      onChange={e => user && handleNoteChange(record.id, e.target.value)}
                      onBlur={e => user && handleNoteBlur(record.id, e.target.value)}
                      placeholder={user ? '설명 입력... (자동 저장)' : ''}
                      readOnly={!user}
                      rows={2}
                      className={`w-full text-xs px-3 py-2 outline-none resize-none border-t ${inputC}`}
                      style={{ borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 업로드 영역 — 로그인 시에만 */}
            {user && (
              <div
                onClick={() => !uploading && inputRef.current.click()}
                className={`border border-dashed ${borderC} ${bgC} rounded-lg p-4 text-center cursor-pointer hover:opacity-80 transition-opacity`}
              >
                {uploading ? (
                  <p className={`text-xs ${muted}`}>업로드 중...</p>
                ) : (
                  <>
                    <p className="text-lg mb-1">+</p>
                    <p className={`text-xs ${muted}`}>클릭하여 이미지 업로드</p>
                    <p className={`text-xs ${muted} mt-0.5`}>PNG · JPG · WEBP</p>
                  </>
                )}
              </div>
            )}
          </>
        )}

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {zoomSrc && <ImageZoomModal src={zoomSrc} onClose={() => setZoomSrc(null)} />}
    </>
  )
}