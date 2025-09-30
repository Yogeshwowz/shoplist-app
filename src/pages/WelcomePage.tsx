import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import CategoryTiles from '../components/CategoryTiles';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'src/data/catalog.json')
      .then(res => res.json())
      .then(data => setCategories(Object.keys(data)));
  }, []);

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to Client Name</h1>
        <h2 className="text-xl text-center mb-8">Shop Our Categories!</h2>
        <CategoryTiles categories={categories} onSelect={cat => navigate(`/category/${encodeURIComponent(cat)}`)} />
      </div>
    </div>
  );
};

export default WelcomePage;