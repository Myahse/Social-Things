import { useCallback, useEffect, useId, useState } from 'react'
import { adviseSize, type Build } from '@/features/product-detail/utils/sizing'
import { PILL_CLASS, PRODUCT_MICRO_CLASS, pillState } from '@/features/product-detail/product-styles'
import { BottomSheet } from '@/shared/components/BottomSheet'
import { useI18n } from '@/shared/i18n/i18n'

const KEY = 'social-things:size-helper' // the visitor's answers, kept on this device only

const FIELD =
  'min-h-12 w-full border-[3px] border-ink bg-canvas px-3 font-display text-sm tracking-[0.12em] text-ink placeholder:text-muted'

/**
 * "Which size for me?" (ported from ArtSyde): height, weight and build give a size among the product's,
 * applied in one tap. Opens in the site's bottom sheet; the answers are remembered on this device.
 */
export function SizeHelper({ sizes, current, onPick }: { sizes: string[]; current: string; onPick: (size: string) => void }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [build, setBuild] = useState<Build>('homme')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const heightId = useId()
  const weightId = useId()
  const close = useCallback(() => setOpen(false), [])

  function openHelper() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null') as { build: Build; height: string; weight: string } | null
      if (saved) {
        setBuild(saved.build === 'femme' ? 'femme' : 'homme')
        setHeight(saved.height ?? '')
        setWeight(saved.weight ?? '')
      }
    } catch {
      // storage unavailable (private window): start empty
    }
    setOpen(true)
  }

  const h = Number(height)
  const w = Number(weight)
  const valid = h >= 130 && h <= 220 && w >= 35 && w <= 180
  const advice = valid ? adviseSize(build, h, w, sizes) : null
  // The product's own spelling of a size (e.g. "m" vs "M"), so picking it matches its size buttons.
  const offered = (size: string) => sizes.find((s) => s.toUpperCase() === size) ?? size

  useEffect(() => {
    if (!valid) return
    try {
      localStorage.setItem(KEY, JSON.stringify({ build, height, weight }))
    } catch {
      // not kept: fine
    }
  }, [valid, build, height, weight])

  function pick(size: string) {
    onPick(offered(size))
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={openHelper}
        aria-haspopup="dialog"
        className="text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
      >
        {t('page.product.sizeHelper')}
      </button>

      <BottomSheet
        open={open}
        onClose={close}
        eyebrow={t('page.product.size')}
        title={t('page.product.sizeHelper')}
        hint={t('page.product.sizeHelperHint')}
        closeLabel={t('page.gallery.close')}
      >
        <div className="mt-5 flex gap-2" role="group" aria-label={t('page.product.sizeHelperBuild')}>
          {(
            [
              ['homme', 'page.product.avatarMen'],
              ['femme', 'page.product.avatarWomen'],
            ] as const
          ).map(([b, label]) => (
            <button
              key={b}
              type="button"
              onClick={() => setBuild(b)}
              aria-pressed={build === b}
              className={`${PILL_CLASS} ${pillState(build === b)}`}
            >
              {t(label)}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-left">
          <div>
            <label htmlFor={heightId} className={`mb-2 block ${PRODUCT_MICRO_CLASS} text-muted`}>
              {t('page.product.sizeHelperHeight')}
            </label>
            <input
              id={heightId}
              inputMode="numeric"
              value={height}
              onChange={(e) => setHeight(e.target.value.replace(/\D/g, '').slice(0, 3))}
              placeholder="175"
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor={weightId} className={`mb-2 block ${PRODUCT_MICRO_CLASS} text-muted`}>
              {t('page.product.sizeHelperWeight')}
            </label>
            <input
              id={weightId}
              inputMode="numeric"
              value={weight}
              onChange={(e) => setWeight(e.target.value.replace(/\D/g, '').slice(0, 3))}
              placeholder="70"
              className={FIELD}
            />
          </div>
        </div>

        <div aria-live="polite" className="text-left">
          {valid && !advice && <p className="mt-4 text-sm text-muted">{t('page.product.sizeHelperNone')}</p>}
          {advice && (
            <div className="mt-4">
              <p className="text-sm text-ink">
                {t('page.product.sizeHelperAdvice')} <b>{advice.size}</b>
                {advice.exact ? '' : ` (${t('page.product.sizeHelperClosest')})`}. {t('page.product.sizeHelperOversize')}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => pick(advice.size)}
                  disabled={current === offered(advice.size)}
                  className="btn-slam !px-4 !py-2.5 disabled:opacity-60"
                >
                  <span>
                    {current === offered(advice.size)
                      ? `${advice.size} ✓`
                      : `${t('page.product.sizeHelperChoose')} ${advice.size}`}
                  </span>
                </button>
                {advice.larger && (
                  <button
                    type="button"
                    onClick={() => pick(advice.larger!)}
                    disabled={current === offered(advice.larger)}
                    className="btn-slam btn-slam-outline !px-4 !py-2.5 disabled:opacity-60"
                  >
                    <span>
                      {current === offered(advice.larger)
                        ? `${advice.larger} ✓`
                        : `${t('page.product.sizeHelperLooser')} ${advice.larger}`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <p className="mt-4 text-left text-xs text-muted">{t('page.product.sizeHelperNote')}</p>
      </BottomSheet>
    </>
  )
}
