import Link from 'next/link';
import TaxonomyForm from '@/components/admin/TaxonomyForm';

export default function NewCategoryPage() {
  return (
    <div>
      <Link href="/admin/categories" style={{ color: '#64748b', fontSize: '.9rem', textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>← Quay lại danh sách</Link>
      <h1 style={{ margin: '0 0 24px', fontSize: '1.5rem' }}>Tạo danh mục mới</h1>
      <TaxonomyForm
        kind="category"
        initial={{ slug: '', labelVi: '', labelEn: '', tone: 'blue', order: 0 }}
      />
    </div>
  );
}
