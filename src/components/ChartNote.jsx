import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../App'
import { supabase } from '../lib/supabase'

/* ── 이미지 확대 모달 ── */
function ImageZoomModal({ src, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <img src={src} alt="" className="max-w-full max-h-[90vh] rounded-xl object-contain" />
    </div>
  )
}

/**
 * ChartNote
 * props:
 *   page    — 페이지 식별자 (예: 'wave', 'candle', 'channel', 'concepts')
 *   section — 섹션 식별자 (예: 'step', 'impulse_basic', 'candle_도지')
 *   label   — 표시 레이블 (예: '예시 차트 사진')
 *   single  — true면 이미지 1장만 (모달용), false면 2열 그리드 (파동이론용)
 */
export default function ChartNote({ page, section, label = '예시 차트 사진', single = false }) {
  const { dark } = useTheme()
  const [records, setRecords] = useState([])   // { id, image_url, note }
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [zoomSrc, setZoomSrc] = useState(null)
  const inputRef = useRef()

  const borderC  = dark ? 'border-white/15' : 'border-black/15'
  const bgC      = dark ? 'bg-[#1a1e2a]'   : 'bg-gray-50'
  const muted    = dark ? 'text-[#7a7f94]' : 'text-gray-400'
  const cardBg   = dark ? 'bg-[#1a1e2a] border-white/10' : 'bg-gray-50 border-black/10'
  const inputC   = dark ? 'bg-[#0d0f14] border-white/10 text-[#e8eaf0] placeholder-[#7a7f94]' : 'bg-white border-black/10 text-[#1a1e2a] placeholder-gray-400'

  /* ── 데이터 로드 ── */
  useEffect(() => {
    fetchRecords()
  }, [page, section])

  async function fetchRecords() {
    setLoading(true)
    const { data, error } = await supabase
      .from('chart_notes')
      .select('*')
      .eq('page', page)
      .eq('section', section)
      .order('created_at', { ascending: true })
    if (!error && data) setRecords(data)
    setLoading(false)
  }

  /* ── 이미지 업로드 ── */
  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)

    const ext = file.name.split('.').pop().toLowerCase()
    const fileName = `${page}/${section}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('chart-images')
      .upload(fileName, file)

    if (uploadError) {
      console.error(uploadError)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('chart-images')
      .getPublicUrl(fileName)

    const { error: insertError } = await supabase
      .from('chart_notes')
      .insert({ page, section, image_url: urlData.publicUrl, note: '' })

    if (!insertError) await fetchRecords()
    setUploading(false)
    e.target.value = ''
  }

  /* ── 노트 수정 ── */
  async function handleNoteChange(id, note) {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, note } : r))
  }

  async function handleNoteBlur(id, note) {
    await supabase
      .from('chart_notes')
      .update({ note, updated_at: new Date().toISOString() })
      .eq('id', id)
  }

  /* ── 삭제 ── */
  async function handleDelete(id, image_url) {
    if (image_url) {
      const path = image_url.split('/chart-images/')[1]
      if (path) await supabase.storage.from('chart-images').remove([path])
    }
    await supabase.from('chart_notes').delete().eq('id', id)
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  const showUpload = single ? records.length === 0 : true

  return (
    <>
      <div className="mt-4">
        <p className="text-xs font-semibold mb-2">{label}</p>

        {loading ? (
          <p className={`text-xs ${muted}`}>불러오는 중...</p>
        ) : (
          <>
            {/* 이미지 그리드 */}
            {records.length > 0 && (
              <div className={`${single ? '' : 'grid grid-cols-2 gap-2'} mb-3`}>
                {records.map(record => (
                  <div key={record.id} className={`rounded-xl border p-3 ${cardBg} mb-2`}>
                    {/* 이미지 */}
                    <div className="relative group mb-2">
                      <img
                        src={record.image_url}
                        alt=""
                        className="w-full rounded-lg object-cover aspect-video cursor-zoom-in"
                        onClick={() => setZoomSrc(record.image_url)}
                      />
                      <button
                        onClick={() => handleDelete(record.id, record.image_url)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs hidden group-hover:flex items-center justify-center"
                      >✕</button>
                    </div>
                    {/* 노트 텍스트 */}
                    <textarea
                      value={record.note || ''}
                      onChange={e => handleNoteChange(record.id, e.target.value)}
                      onBlur={e => handleNoteBlur(record.id, e.target.value)}
                      placeholder="설명 입력... (자동 저장)"
                      rows={2}
                      className={`w-full text-xs rounded-lg border px-3 py-2 outline-none resize-none ${inputC}`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 업로드 버튼 */}
            {showUpload && (
              <div
                onClick={() => !uploading && inputRef.current.click()}
                className={`border border-dashed ${borderC} ${bgC} rounded-lg p-4 text-center cursor-pointer hover:opacity-80 transition-opacity`}
              >
                {uploading ? (
                  <p className={`text-xs ${muted}`}>업로드 중...</p>
                ) : (
                  <>
                    <p className="text-lg mb-1">+</p>
                    <p className={`text-xs ${muted}`}>클릭하여 차트 사진 업로드</p>
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
