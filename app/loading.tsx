import css from '@/components/AuthProvider/AuthProvider.module.css';

export default function Loading() {
  return (
    <div className={css.loaderContainer}>
      <div className={css.spinner}></div>
    </div>
  );
}
