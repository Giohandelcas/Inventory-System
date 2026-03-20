import { useEffect, useState } from 'react';
import { getCategories, createCategory, deleteCategory } from '../api';
import { Plus, Trash2, Tag } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => getCategories().then(r => setCategories(r.data));
  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createCategory({ name: newName.trim() });
      setNewName('');
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!confirm(`Delete "${c.name}"?`)) return;
    try {
      await deleteCategory(c.id);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Cannot delete category');
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900">Categories</h1>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Add Category</h2>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <div className="flex gap-2">
          <input
            required
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Category name..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </form>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {categories.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <Tag size={28} className="mx-auto mb-2 opacity-40" />
            No categories yet
          </div>
        )}
        {categories.map(c => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <Tag size={16} className="text-indigo-500" />
              <span className="text-sm font-medium text-gray-800">{c.name}</span>
            </div>
            <button
              onClick={() => handleDelete(c)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
