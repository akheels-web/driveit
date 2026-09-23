// The shadcn template shipped a second copy of this hook that set state inside
// an effect. There is now one implementation — this file just re-exports it so
// any imports of `@/components/ui/use-mobile` keep working.
export { useIsMobile } from '@/hooks/use-mobile'
