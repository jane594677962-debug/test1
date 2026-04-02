import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Home, 
  ShoppingBag, 
  PlayCircle, 
  Heart, 
  User,
  ChevronLeft,
  Share2,
  MessageCircle,
  ExternalLink,
  Clock,
  BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Page = 'home' | 'market' | 'video' | 'favorite' | 'profile' | 'detail' | 'search' | 'productDetail' | 'checkout' | 'cart';
type Tab = 'recommend' | 'discover' | 'follow' | 'mealplan';

interface CartItem {
  product: Product;
  quantity: number;
}

interface Recipe {
  id: number;
  title: string;
  image: string;
  author: string;
  authorAvatar: string;
  likes: string;
  tags?: string[];
  isHot?: boolean;
  isNew?: boolean;
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
}

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  sales: number;
  isNew: boolean;
  category: string;
}

// --- Mock Data ---
const RECIPES: Recipe[] = [
  {
    id: 1,
    title: '在家就能做的超健康曲奇，好吃不腻，动手...',
    image: 'https://picsum.photos/seed/cookie/400/500',
    author: '健身小达人',
    authorAvatar: 'https://picsum.photos/seed/avatar1/100/100',
    likes: '15.0万',
  },
  {
    id: 2,
    title: '在家就能做的牛肉吉士汉堡，动手做起来',
    image: 'https://picsum.photos/seed/burger/400/400',
    author: '小吃货',
    authorAvatar: 'https://picsum.photos/seed/avatar2/100/100',
    likes: '10.2万',
  },
  {
    id: 3,
    title: '孩子最爱的披萨，十分钟就能开吃！',
    image: 'https://picsum.photos/seed/pizza/400/600',
    author: '大美美食家',
    authorAvatar: 'https://picsum.photos/seed/avatar3/100/100',
    likes: '8.5万',
  },
  {
    id: 4,
    title: '自己也要好好吃饭，一人食西餐',
    image: 'https://picsum.photos/seed/steak/400/300',
    author: '西餐小姐姐',
    authorAvatar: 'https://picsum.photos/seed/avatar4/100/100',
    likes: '12.1万',
  },
];

const CATEGORIES = ['热门作品', '午餐', '火锅', '玩面粉', '粤菜', '甜品', '一人食', '素食'];

const MARKET_PRODUCTS: Product[] = [
  { id: 1, name: '费格即食小慕斯 下午茶首选', image: 'https://picsum.photos/seed/p1/300/300', price: 39.9, sales: 510, isNew: true, category: 'baking' },
  { id: 2, name: '有机高筋面粉 5kg 烘焙专用', image: 'https://picsum.photos/seed/p2/300/300', price: 58.0, sales: 1200, isNew: false, category: 'baking' },
  { id: 3, name: '日式陶瓷餐具套装 简约风', image: 'https://picsum.photos/seed/p3/300/300', price: 128.0, sales: 340, isNew: true, category: 'tools' },
  { id: 4, name: '特级初榨橄榄油 750ml', image: 'https://picsum.photos/seed/p4/300/300', price: 89.0, sales: 890, isNew: false, category: 'fresh' },
  { id: 5, name: '手工草莓果酱 低糖配方', image: 'https://picsum.photos/seed/p5/300/300', price: 25.5, sales: 2100, isNew: false, category: 'fresh' },
  { id: 6, name: '不锈钢打蛋器 烘焙必备', image: 'https://picsum.photos/seed/p6/300/300', price: 15.9, sales: 4500, isNew: false, category: 'tools' },
  { id: 7, name: '进口无盐黄油 250g', image: 'https://picsum.photos/seed/p7/300/300', price: 32.0, sales: 1560, isNew: true, category: 'baking' },
  { id: 8, name: '新鲜红富士苹果 5斤装', image: 'https://picsum.photos/seed/p8/300/300', price: 45.0, sales: 3200, isNew: true, category: 'fresh' },
];

// --- Components ---

const TopBar = ({ showSearch = true, onSearchClick }: { showSearch?: boolean, onSearchClick?: () => void }) => (
  <div className="flex items-center justify-between px-4 py-2 bg-white sticky top-0 z-50">
    {showSearch ? (
      <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-1.5 mr-3" onClick={onSearchClick}>
        <Search size={18} className="text-gray-400 mr-2" />
        <input 
          type="text" 
          placeholder="搜索菜谱或食材" 
          className="bg-transparent border-none outline-none text-sm w-full"
          readOnly
        />
      </div>
    ) : <div className="flex-1" />}
    <div className="flex items-center space-x-4">
      <Bell size={22} className="text-gray-700 cursor-pointer" />
      <Plus size={22} className="text-gray-700 cursor-pointer" />
    </div>
  </div>
);

const BottomNav = ({ activePage, setActivePage }: { activePage: Page, setActivePage: (p: Page) => void }) => {
  const navItems: { id: Page; icon: any; label: string }[] = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'market', icon: ShoppingBag, label: '市集' },
    { id: 'video', icon: PlayCircle, label: '课堂' },
    { id: 'favorite', icon: Heart, label: '收藏' },
    { id: 'profile', icon: User, label: '我的' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-50 max-w-md mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button 
            key={item.id} 
            onClick={() => setActivePage(item.id)}
            className="flex flex-col items-center space-y-1"
          >
            <div className={`relative ${isActive ? 'text-primary' : 'text-gray-400'}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

const RecipeCard: React.FC<{ 
  recipe: Recipe; 
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}> = ({ recipe, onClick, isFavorite, onToggleFavorite }) => (
  <motion.div 
    whileTap={{ scale: 0.98 }}
    className="bg-white rounded-xl overflow-hidden shadow-sm mb-3 cursor-pointer"
    onClick={onClick}
  >
    <div className="relative aspect-[4/5]">
      <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      {recipe.isHot && (
        <span className="absolute top-2 left-2 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded font-bold">HOT</span>
      )}
      <button 
        onClick={onToggleFavorite}
        className="absolute top-2 right-2 w-8 h-8 bg-black/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
      >
        <Heart size={16} fill={isFavorite ? "#FF4D4D" : "none"} color={isFavorite ? "#FF4D4D" : "currentColor"} />
      </button>
    </div>
    <div className="p-2.5">
      <h3 className="text-sm font-medium line-clamp-2 leading-snug mb-2">{recipe.title}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <img src={recipe.authorAvatar} alt={recipe.author} className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
          <span className="text-[11px] text-gray-500">{recipe.author}</span>
        </div>
        <div className="flex items-center text-gray-400 space-x-0.5">
          <Heart size={12} fill={isFavorite ? "#FF4D4D" : "none"} color={isFavorite ? "#FF4D4D" : "currentColor"} />
          <span className="text-[11px]">{recipe.likes}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Page Views ---

const HomePage = ({ 
  onRecipeClick, 
  favorites, 
  onToggleFavorite,
  onSearchClick
}: { 
  onRecipeClick: (recipe: Recipe) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onSearchClick: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('discover');

  return (
    <div className="pb-20">
      <TopBar onSearchClick={onSearchClick} />
      
      {/* Tabs */}
      <div className="flex items-center px-4 space-x-6 bg-white border-b border-gray-50">
        {(['recommend', 'discover', 'follow', 'mealplan'] as Tab[]).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-base font-medium relative ${activeTab === tab ? 'text-black' : 'text-gray-400'}`}
          >
            {tab === 'recommend' && '推荐'}
            {tab === 'discover' && '发现'}
            {tab === 'follow' && '关注'}
            {tab === 'mealplan' && '配餐'}
            {activeTab === tab && (
              <motion.div 
                layoutId="tab-underline"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'recommend' && (
        <div className="p-4">
          <div className="bg-primary/5 rounded-2xl p-6 mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">今日推荐食谱</h3>
              <p className="text-xs text-gray-500">根据您的口味为您精选</p>
            </div>
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
              <Heart size={24} fill="currentColor" />
            </div>
          </div>
          <div className="masonry-grid">
            {RECIPES.slice(0, 2).map((recipe) => (
              <RecipeCard 
                key={`rec-${recipe.id}`} 
                recipe={recipe} 
                onClick={() => onRecipeClick(recipe)}
                isFavorite={favorites.includes(recipe.id)}
                onToggleFavorite={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(recipe.id);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'discover' && (
        <div className="p-4">
          {/* Horizontal Banner */}
          <div className="flex space-x-3 overflow-x-auto hide-scrollbar mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[240px] h-32 rounded-xl overflow-hidden relative flex-shrink-0">
                <img 
                  src={`https://picsum.photos/seed/banner${i}/500/300`} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-primary text-white text-[10px] px-1 rounded">HOT</span>
                    <span className="text-white text-xs font-medium">家味食谱有奖征集</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Category Pills */}
          <div className="flex space-x-2 overflow-x-auto hide-scrollbar mb-6">
            {CATEGORIES.map((cat, idx) => (
              <button 
                key={cat}
                className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap ${idx === 0 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="masonry-grid">
            {RECIPES.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onClick={() => onRecipeClick(recipe)}
                isFavorite={favorites.includes(recipe.id)}
                onToggleFavorite={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(recipe.id);
                }}
              />
            ))}
            {/* Duplicate for demo */}
            {RECIPES.map((recipe) => (
              <RecipeCard 
                key={`dup-${recipe.id}`} 
                recipe={recipe} 
                onClick={() => onRecipeClick(recipe)}
                isFavorite={favorites.includes(recipe.id)}
                onToggleFavorite={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(recipe.id);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'follow' && (
        <div className="p-4 space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="text-sm font-semibold">西餐小姐姐</h4>
                    <p className="text-[10px] text-gray-400">1小时前</p>
                  </div>
                </div>
                <button className="text-primary text-xs font-medium border border-primary px-3 py-1 rounded-full">+ 关注</button>
              </div>
              <img src={`https://picsum.photos/seed/post${i}/600/400`} className="w-full aspect-video object-cover rounded-xl mb-3" referrerPolicy="no-referrer" />
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <Heart size={20} className="text-gray-600 cursor-pointer" />
                  <MessageCircle size={20} className="text-gray-600 cursor-pointer" />
                  <Share2 size={20} className="text-gray-600 cursor-pointer" />
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(j => (
                    <img key={j} src={`https://picsum.photos/seed/liker${j}/50/50`} className="w-5 h-5 rounded-full border-2 border-white" referrerPolicy="no-referrer" />
                  ))}
                  <span className="text-[10px] text-gray-400 ml-3 self-center">32个赞</span>
                </div>
              </div>
              <h5 className="text-sm font-bold mb-1">今天自己做份西餐778</h5>
              <p className="text-xs text-gray-500 line-clamp-2">看了菜谱，一下子就做出来了。人生这么短暂，还是不要... <span className="text-gray-300">更多</span></p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'mealplan' && (
        <div className="p-4">
          <div className="flex space-x-4 overflow-x-auto hide-scrollbar mb-6">
            {['一家三口', '一人食', '养生餐', '西餐', '年夜饭'].map((item, idx) => (
              <button key={item} className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap ${idx === 0 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <img src="https://picsum.photos/seed/meal/600/400" className="w-full aspect-square object-cover" referrerPolicy="no-referrer" />
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">三菜一汤 | 一家三口营养晚餐</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">椒盐鸡翅+炒时蔬+南瓜烤蛋糕+鲫鱼汤，一家三口的营养均衡搭配。大人小孩都喜欢。</p>
              <div className="flex items-center space-x-6 text-[11px] text-gray-400">
                <div className="flex items-center space-x-1"><Clock size={12} /> <span>20min</span></div>
                <div className="flex items-center space-x-1"><BarChart2 size={12} /> <span>简单</span></div>
                <div className="flex items-center space-x-1"><span>三菜一汤</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MarketPage = ({ 
  onProductClick,
  cartCount,
  onCartClick
}: { 
  onProductClick: (product: Product) => void;
  cartCount: number;
  onCartClick: () => void;
}) => {
  const [activeTab, setActiveTab] = useState('selected');
  const [sortBy, setSortBy] = useState<'default' | 'price' | 'sales' | 'new'>('default');

  const getFilteredProducts = () => {
    let filtered = [...MARKET_PRODUCTS];
    
    if (activeTab !== 'selected') {
      filtered = filtered.filter(p => p.category === activeTab);
    }

    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'sales':
        filtered.sort((a, b) => b.sales - a.sales);
        break;
      case 'new':
        filtered.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const products = getFilteredProducts();

  return (
    <div className="pb-20">
      <TopBar />
      
      {/* Market Header with Cart */}
      <div className="flex items-center justify-between px-4 py-2 bg-white">
        <h2 className="text-xl font-bold">市集</h2>
        <button 
          onClick={onCartClick}
          className="relative p-2 text-gray-600"
        >
          <ShoppingBag size={24} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Market Tabs */}
      <div className="flex items-center px-4 space-x-6 bg-white border-b border-gray-50">
        {[
          { id: 'selected', label: '精选' },
          { id: 'fresh', label: '生鲜' },
          { id: 'baking', label: '烘焙' },
          { id: 'tools', label: '器具' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 text-sm font-medium relative ${activeTab === tab.id ? 'text-black' : 'text-gray-400'}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="market-tab-underline"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Sort Bar */}
        <div className="flex items-center space-x-6 mb-6 text-xs text-gray-500">
          <button 
            onClick={() => setSortBy('default')}
            className={sortBy === 'default' ? 'text-primary font-bold' : ''}
          >
            综合
          </button>
          <button 
            onClick={() => setSortBy('sales')}
            className={sortBy === 'sales' ? 'text-primary font-bold' : ''}
          >
            销量
          </button>
          <button 
            onClick={() => setSortBy('new')}
            className={sortBy === 'new' ? 'text-primary font-bold' : ''}
          >
            新品
          </button>
          <button 
            onClick={() => setSortBy('price')}
            className={sortBy === 'price' ? 'text-primary font-bold' : ''}
          >
            价格
          </button>
        </div>

        {activeTab === 'selected' && (
          <>
            {/* Category Grid */}
            <div className="grid grid-cols-4 gap-y-6 mb-8">
              {[
                { icon: '🧁', label: '烘焙' },
                { icon: '🥦', label: '果蔬生鲜' },
                { icon: '🥣', label: '器具' },
                { icon: '🍹', label: '饮品茶酒' },
                { icon: '🍜', label: '方便食品' },
                { icon: '🍪', label: '零食' },
                { icon: '✈️', label: '进口食品' },
                { icon: '🧂', label: '调味品' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                    {item.icon}
                  </div>
                  <span className="text-[11px] text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Promo Banner */}
            <div className="bg-red-50 rounded-2xl p-4 flex items-center justify-between mb-8">
              <div>
                <h4 className="text-primary font-bold text-sm">超“大额”现金礼券</h4>
                <p className="text-[10px] text-primary/70">超多现金券，现在就去 ➔</p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">领</div>
            </div>
          </>
        )}

        {/* Market List */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">{activeTab === 'selected' ? '市集上新' : '频道精选'}</h3>
          <span className="text-[10px] text-gray-400">发现更多好物 ➔</span>
        </div>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {products.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer"
                onClick={() => onProductClick(product)}
              >
                <div className="relative aspect-square">
                  <img src={product.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {product.isNew && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-[8px] px-1 py-0.5 rounded font-bold">NEW</span>
                  )}
                </div>
                <div className="p-3">
                  <h5 className="text-xs font-medium mb-1 line-clamp-2 h-8">{product.name}</h5>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-sm">¥{product.price.toFixed(2)}</span>
                    <span className="text-[10px] text-gray-400">{product.sales}人付款</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400">
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-sm">该频道暂无商品</p>
          </div>
        )}
      </div>
    </div>
  );
};

const VideoPage = () => {
  const [activeTab, setActiveTab] = useState('beginner');

  return (
    <div className="pb-20 min-h-screen">
      <TopBar showSearch={false} />
      <div className="px-4 py-2">
        <h2 className="text-xl font-bold mb-4">厨艺课堂</h2>
      </div>

      {/* Video Tabs */}
      <div className="flex items-center px-4 space-x-6 bg-white border-b border-gray-50">
        {[
          { id: 'beginner', label: '新手入门' },
          { id: 'advanced', label: '进阶挑战' },
          { id: 'live', label: '直播课' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 text-sm font-medium relative ${activeTab === tab.id ? 'text-black' : 'text-gray-400'}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="video-tab-underline"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm relative">
            <img src={`https://picsum.photos/seed/video${i}/600/350`} className="w-full aspect-video object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <PlayCircle size={48} className="text-white opacity-80" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {activeTab === 'beginner' ? '入门' : activeTab === 'advanced' ? '进阶' : '直播'}
                </span>
                <span className="text-[10px] text-gray-400">1.2k人已学</span>
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                {activeTab === 'beginner' && '零基础也能做出的五星级意面'}
                {activeTab === 'advanced' && '法式甜品的灵魂：马卡龙制作全流程'}
                {activeTab === 'live' && '今晚8点：名厨教你做正宗红烧肉'}
              </h3>
              <p className="text-[11px] text-gray-500">讲师：美食达人阿强</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfilePage = ({ favoriteCount }: { favoriteCount: number }) => {
  const [activeTab, setActiveTab] = useState('recipes');

  return (
    <div className="pb-20">
      <div className="bg-primary pt-12 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-4 right-4 flex space-x-4 text-white">
          <User size={22} className="cursor-pointer" />
          <Plus size={22} className="cursor-pointer" />
        </div>
        <div className="flex items-center space-x-4 mb-8">
          <img src="https://picsum.photos/seed/me/150/150" className="w-16 h-16 rounded-full border-2 border-white/30" referrerPolicy="no-referrer" />
          <div className="text-white">
            <h2 className="text-xl font-bold flex items-center">叫我小爱 <ExternalLink size={14} className="ml-2 opacity-50" /></h2>
            <p className="text-xs opacity-80">唯有美食与爱不可辜负~</p>
          </div>
        </div>
        <div className="flex justify-between text-white px-4">
          <div className="text-center">
            <p className="text-lg font-bold">3365</p>
            <p className="text-[10px] opacity-70">关注</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">16,370</p>
            <p className="text-[10px] opacity-70">粉丝</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{220 + favoriteCount}</p>
            <p className="text-[10px] opacity-70">赞与收藏</p>
          </div>
        </div>
        {/* Curved background overlap */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-bg-gray rounded-t-[32px]" />
      </div>

      <div className="px-6 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl p-4 shadow-sm grid grid-cols-4 gap-4 mb-6">
          {[
            { icon: '🍎', label: '菜篮子' },
            { icon: '📚', label: '课程·书架' },
            { icon: '📋', label: '订单' },
            { icon: '👛', label: '钱包' },
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center space-y-1 cursor-pointer">
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex space-x-8 border-b border-gray-100 mb-4">
          <button 
            onClick={() => setActiveTab('recipes')}
            className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'recipes' ? 'border-primary text-black' : 'border-transparent text-gray-400'}`}
          >
            菜谱
          </button>
          <button 
            onClick={() => setActiveTab('works')}
            className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'works' ? 'border-primary text-black' : 'border-transparent text-gray-400'}`}
          >
            作品
          </button>
        </div>

        {activeTab === 'recipes' ? (
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <img key={i} src={`https://picsum.photos/seed/myrecipe${i}/200/200`} className="w-full aspect-square object-cover" referrerPolicy="no-referrer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <img src={`https://picsum.photos/seed/mywork${i}/300/300`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute bottom-2 left-2 flex items-center text-white text-[10px]">
                  <Heart size={10} fill="white" className="mr-1" /> 128
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FavoritePage = ({ 
  favorites, 
  favoriteProducts,
  onRecipeClick, 
  onProductClick,
  onToggleFavorite,
  onToggleFavoriteProduct
}: { 
  favorites: number[];
  favoriteProducts: number[];
  onRecipeClick: (recipe: Recipe) => void;
  onProductClick: (product: Product) => void;
  onToggleFavorite: (id: number) => void;
  onToggleFavoriteProduct: (id: number) => void;
}) => {
  const [activeTab, setActiveTab] = useState('recipes');
  const favoriteRecipes = RECIPES.filter(r => favorites.includes(r.id));
  const favProducts = MARKET_PRODUCTS.filter(p => favoriteProducts.includes(p.id));

  return (
    <div className="pb-20 min-h-screen">
      <div className="px-4 py-6 bg-white sticky top-0 z-50">
        <h2 className="text-xl font-bold">我的收藏</h2>
      </div>

      {/* Favorite Tabs */}
      <div className="flex items-center px-4 space-x-6 bg-white border-b border-gray-50">
        {[
          { id: 'recipes', label: '食谱' },
          { id: 'products', label: '商品' },
          { id: 'articles', label: '文章' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 text-sm font-medium relative ${activeTab === tab.id ? 'text-black' : 'text-gray-400'}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="favorite-tab-underline"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full"
              />
            )}
          </button>
        ))}
      </div>
      
      {activeTab === 'recipes' && (
        favoriteRecipes.length > 0 ? (
          <div className="p-4 masonry-grid">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onClick={() => onRecipeClick(recipe)}
                isFavorite={true}
                onToggleFavorite={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(recipe.id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Heart size={48} className="mb-4 opacity-20" />
            <p className="text-sm">暂无收藏的食谱</p>
          </div>
        )
      )}

      {activeTab === 'products' && (
        favProducts.length > 0 ? (
          <div className="p-4 grid grid-cols-2 gap-4">
            {favProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer relative"
                onClick={() => onProductClick(product)}
              >
                <div className="relative aspect-square">
                  <img src={product.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavoriteProduct(product.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                  >
                    <Heart size={16} fill="#FF4D4D" color="#FF4D4D" />
                  </button>
                </div>
                <div className="p-3">
                  <h5 className="text-xs font-medium mb-1 line-clamp-2 h-8">{product.name}</h5>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold text-sm">¥{product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShoppingBag size={48} className="mb-4 opacity-20" />
            <p className="text-sm">暂无收藏的商品</p>
          </div>
        )
      )}

      {activeTab === 'articles' && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Heart size={48} className="mb-4 opacity-20" />
          <p className="text-sm">暂无收藏的文章</p>
        </div>
      )}
    </div>
  );
};

const SearchPage = ({ 
  history, 
  onSearch, 
  onClearHistory, 
  onBack,
  onRecipeClick,
  favorites,
  onToggleFavorite
}: { 
  history: string[]; 
  onSearch: (keyword: string) => void; 
  onClearHistory: () => void;
  onBack: () => void;
  onRecipeClick: (recipe: Recipe) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
}) => {
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Recipe[]>([]);

  const handleSearch = (k: string) => {
    const searchKeyword = k || keyword;
    if (!searchKeyword.trim()) return;
    
    setKeyword(searchKeyword);
    setIsSearching(true);
    onSearch(searchKeyword);
    
    // Mock search results
    const filtered = RECIPES.filter(r => 
      r.title.includes(searchKeyword) || r.author.includes(searchKeyword)
    );
    setResults(filtered);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="flex items-center px-4 py-2 sticky top-0 bg-white z-50">
        <button onClick={onBack} className="mr-3 text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-1.5">
          <Search size={18} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(keyword)}
            placeholder="搜索菜谱或食材" 
            className="bg-transparent border-none outline-none text-sm w-full"
            autoFocus
          />
          {keyword && (
            <button onClick={() => setKeyword('')} className="text-gray-400 ml-2">
              <Plus size={16} className="rotate-45" />
            </button>
          )}
        </div>
        <button 
          onClick={() => handleSearch(keyword)}
          className="ml-3 text-primary font-medium text-sm"
        >
          搜索
        </button>
      </div>

      {!isSearching ? (
        <div className="p-4">
          {history.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800">最近搜索</h3>
                <button onClick={onClearHistory} className="text-gray-400">
                  <Plus size={16} className="rotate-45" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSearch(item)}
                    className="px-4 py-1.5 bg-gray-50 rounded-full text-xs text-gray-600"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-4">热门搜索</h3>
            <div className="flex flex-wrap gap-2">
              {['抹茶蛋糕', '减脂餐', '家常小炒', '空气炸锅', '早餐', '牛肉汉堡'].map((item) => (
                <button 
                  key={item}
                  onClick={() => handleSearch(item)}
                  className="px-4 py-1.5 bg-gray-50 rounded-full text-xs text-gray-600"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4">搜索结果</h3>
            {results.length > 0 ? (
              <div className="masonry-grid">
                {results.map((recipe) => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    onClick={() => onRecipeClick(recipe)}
                    isFavorite={favorites.includes(recipe.id)}
                    onToggleFavorite={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(recipe.id);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p className="text-sm">未找到相关食谱</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-4">与您搜索相关</h3>
            <div className="masonry-grid">
              {RECIPES.filter(r => !results.find(res => res.id === r.id)).slice(0, 2).map((recipe) => (
                <RecipeCard 
                  key={`rel-${recipe.id}`} 
                  recipe={recipe} 
                  onClick={() => onRecipeClick(recipe)}
                  isFavorite={favorites.includes(recipe.id)}
                  onToggleFavorite={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(recipe.id);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const ProductDetailPage = ({ 
  product, 
  onBack, 
  onBuy, 
  onAddToCart,
  isFavorite, 
  onToggleFavorite 
}: { 
  product: Product | null; 
  onBack: () => void; 
  onBuy: () => void;
  onAddToCart: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}) => {
  if (!product) return null;

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="relative aspect-square">
        <img src={product.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
          <ChevronLeft size={24} />
        </button>
        <div className="absolute top-4 right-4 flex space-x-3">
          <button className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline space-x-1">
            <span className="text-primary text-2xl font-bold">¥{product.price.toFixed(2)}</span>
            <span className="text-gray-400 text-xs line-through">¥{(product.price * 1.2).toFixed(2)}</span>
          </div>
          <span className="text-xs text-gray-400">已售 {product.sales}</span>
        </div>
        <h1 className="text-lg font-bold text-gray-800 mb-4 leading-relaxed">{product.name}</h1>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-8">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <span className="w-1 h-1 bg-primary rounded-full" />
              <span>顺丰包邮</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1 h-1 bg-primary rounded-full" />
              <span>7天无理由退换</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold mb-4">商品详情</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              这款{product.name}是我们的明星产品。采用优质原材料，精心制作而成。无论是口感还是品质，都经过严格把控。
            </p>
            <img src={`https://picsum.photos/seed/detail1/600/800`} className="w-full rounded-xl" referrerPolicy="no-referrer" />
            <p className="text-sm text-gray-600 leading-relaxed">
              每一份都包含着我们的匠心，希望为您带来不一样的味觉体验。
            </p>
            <img src={`https://picsum.photos/seed/detail2/600/800`} className="w-full rounded-xl" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex items-center space-x-3 z-50 max-w-md mx-auto">
        <button 
          onClick={() => onToggleFavorite(product.id)}
          className="flex flex-col items-center space-y-0.5 text-gray-500 flex-shrink-0 min-w-[40px]"
        >
          <Heart size={18} fill={isFavorite ? "#FF4D4D" : "none"} color={isFavorite ? "#FF4D4D" : "currentColor"} />
          <span className="text-[9px]">收藏</span>
        </button>
        <button className="flex flex-col items-center space-y-0.5 text-gray-500 flex-shrink-0 min-w-[40px]">
          <ShoppingBag size={18} />
          <span className="text-[9px]">客服</span>
        </button>
        <div className="flex-1 flex space-x-2">
          <button 
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-primary/10 text-primary py-2 rounded-full text-xs font-bold whitespace-nowrap"
          >
            加入购物车
          </button>
          <button 
            onClick={onBuy}
            className="flex-1 bg-primary text-white py-2 rounded-full text-xs font-bold whitespace-nowrap"
          >
            立即购买
          </button>
        </div>
      </div>
    </div>
  );
};

const CartPage = ({ 
  cart, 
  onBack, 
  onUpdateQuantity, 
  onRemove, 
  onCheckout 
}: { 
  cart: CartItem[]; 
  onBack: () => void; 
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: (selectedItems: CartItem[]) => void;
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(cart.map(item => item.product.id));
  
  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cart.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map(item => item.product.id));
    }
  };

  const selectedItems = cart.filter(item => selectedIds.includes(item.product.id));
  const total = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-50">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-3 text-gray-600">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold">购物车 ({cart.length})</h2>
        </div>
        {cart.length > 0 && (
          <button className="text-sm text-gray-500">管理</button>
        )}
      </div>

      {cart.length > 0 ? (
        <div className="p-4 space-y-4">
          {cart.map((item) => {
            const isSelected = selectedIds.includes(item.product.id);
            return (
              <div key={item.product.id} className="bg-white rounded-2xl p-4 flex items-center space-x-3 shadow-sm">
                <button 
                  onClick={() => toggleSelect(item.product.id)}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                </button>
                <img src={item.product.image} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1 flex flex-col justify-between h-20">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{item.product.name}</h3>
                      <button onClick={() => onRemove(item.product.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Plus size={16} className="rotate-45" />
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">规格：默认</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold">¥{item.product.price.toFixed(2)}</span>
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-2 py-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-5 h-5 flex items-center justify-center text-gray-400 disabled:opacity-30"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-5 h-5 flex items-center justify-center text-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={48} className="opacity-20" />
          </div>
          <p className="text-sm">购物车空空如也</p>
          <button 
            onClick={onBack}
            className="mt-6 px-8 py-2 border border-primary text-primary rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors"
          >
            去逛逛
          </button>
        </div>
      )}

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between z-50 max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleSelectAll}
              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                selectedIds.length === cart.length ? 'bg-primary border-primary text-white' : 'border-gray-300'
              }`}
            >
              {selectedIds.length === cart.length && <div className="w-2 h-2 bg-white rounded-full" />}
            </button>
            <span className="text-xs text-gray-500">全选</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-[10px] text-gray-400">不含运费</p>
              <p className="text-primary text-lg font-bold">¥{total.toFixed(2)}</p>
            </div>
            <button 
              onClick={() => onCheckout(selectedItems)}
              disabled={selectedItems.length === 0}
              className="bg-primary text-white px-8 py-2.5 rounded-full text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              结算({selectedItems.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckoutPage = ({ 
  items, 
  onBack,
  onSuccess
}: { 
  items: CartItem[]; 
  onBack: () => void; 
  onSuccess: (itemIds: number[]) => void;
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (items.length === 0) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onSuccess(items.map(i => i.product.id));
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6"
        >
          <div className="text-4xl">✓</div>
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">支付成功！</h2>
        <p className="text-gray-500 text-sm mb-8">您的宝贝正在准备中，请耐心等待。</p>
        <button 
          onClick={onBack}
          className="w-full bg-primary text-white py-3 rounded-full font-bold shadow-lg shadow-primary/20"
        >
          返回市集
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-white px-4 py-4 flex items-center sticky top-0 z-50 border-b border-gray-50">
        <button onClick={onBack} className="mr-3 text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">确认订单</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Address */}
        <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">叫我小爱 <span className="text-gray-400 font-normal ml-2">138****8888</span></p>
              <p className="text-xs text-gray-500 mt-0.5">北京市朝阳区某某街道某某大厦 12层</p>
            </div>
          </div>
          <ChevronLeft size={16} className="rotate-180 text-gray-300" />
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-2xl p-4 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-50 pb-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">商品清单</h3>
            <span className="text-[10px] text-gray-400">共 {items.length} 件</span>
          </div>
          {items.map((item) => (
            <div key={item.product.id} className="flex space-x-3">
              <img src={item.product.image} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{item.product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-sm">¥{item.product.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-400">x{item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="border-t border-gray-50 pt-4 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">商品总额</span>
              <span className="text-gray-800 font-medium">¥{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">运费</span>
              <span className="text-green-500 font-medium">免运费</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">优惠券</span>
              <span className="text-gray-400">无可用</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">支付方式</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white text-[10px] font-bold">支</div>
              <span className="text-sm font-medium">支付宝支付</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex items-center justify-between z-50 max-w-md mx-auto">
        <div>
          <span className="text-xs text-gray-500">合计：</span>
          <span className="text-primary text-xl font-bold">¥{total.toFixed(2)}</span>
        </div>
        <button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="bg-primary text-white px-10 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>处理中...</span>
            </>
          ) : (
            <span>立即支付</span>
          )}
        </button>
      </div>
    </div>
  );
};

const RecipeDetailPage = ({ 
  recipe,
  onBack,
  isFavorite,
  onToggleFavorite,
  comments,
  onAddComment
}: { 
  recipe: Recipe | null;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  comments: Comment[];
  onAddComment: (content: string) => void;
}) => {
  const [commentText, setCommentText] = useState('');

  if (!recipe) return null;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="relative aspect-square">
        <img src={recipe.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <button onClick={onBack} className="absolute top-4 left-4 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
          <ChevronLeft size={24} />
        </button>
        <div className="absolute top-4 right-4 flex space-x-3">
          <button className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <Share2 size={20} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-2xl font-bold mb-1">{recipe.title}</h1>
          <div className="flex items-center space-x-4 text-xs opacity-90">
            <span>7.9评分</span>
            <span>20万收藏</span>
            <span>32万次浏览</span>
          </div>
        </div>
        <button 
          onClick={() => onToggleFavorite(recipe.id)}
          className="absolute -bottom-6 right-6 w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer"
        >
          <Heart size={24} fill={isFavorite ? "white" : "none"} color="white" />
        </button>
      </div>

      <div className="p-6 pt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <img src={recipe.authorAvatar} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
            <div>
              <h4 className="text-sm font-bold">{recipe.author} <span className="text-primary text-[10px] ml-1 border border-primary px-1 rounded cursor-pointer">+ 关注</span></h4>
              <p className="text-[10px] text-gray-400">生活没有美食，只能叫生存</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-8">
          春天到了，这个蛋糕是不是非常应景呢！非常好吃又不会甜腻的清新抹茶芝士蛋糕，会给大家带来视觉与味觉的全新感受！
        </p>

        <div className="flex justify-around bg-gray-50 rounded-2xl py-4 mb-8">
          <div className="text-center">
            <Clock size={18} className="mx-auto mb-1 text-gray-400" />
            <p className="text-[10px] text-gray-500">20min</p>
          </div>
          <div className="text-center">
            <BarChart2 size={18} className="mx-auto mb-1 text-gray-400" />
            <p className="text-[10px] text-gray-500">简单</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">用料</h3>
            <div className="flex space-x-4 text-[10px] text-gray-400">
              <span className="cursor-pointer">丢进菜篮子</span>
              <span className="cursor-pointer">去购买</span>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { name: '抹茶（最好是现磨的）', amount: '10g' },
              { name: '雀巢芝士', amount: '10g' },
              { name: '鹌鹑蛋', amount: '1颗' },
            ].map(item => (
              <div key={item.name} className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="text-sm text-gray-400">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">步骤</h3>
            <span className="text-[10px] text-gray-400 cursor-pointer">进入料理模式</span>
          </div>
          <div className="space-y-8">
            {[1, 2, 3].map(step => (
              <div key={step}>
                <p className="text-sm font-bold mb-3">· 步骤 {step}</p>
                <img src={`https://picsum.photos/seed/step${step}/600/400`} className="w-full aspect-video object-cover rounded-xl mb-3" referrerPolicy="no-referrer" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step === 1 && "拿出小奶锅，按照先后次序加入面粉50g、白砂糖10g、黄油10g、植物油少许、盐少许、清水100ml，并充分搅拌均匀。"}
                  {step === 2 && "将搅拌好的面糊倒入模具中，轻轻震出气泡。放入预热好的烤箱，180度烘烤25分钟，直到表面金黄。"}
                  {step === 3 && "取出晾凉后，撒上少许抹茶粉装饰。切成小块即可享用，冷藏后口感更佳哦！"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cooking Tips */}
        <div className="mt-10 pt-8 border-t border-gray-50">
          <h3 className="text-lg font-bold mb-4">小贴士</h3>
          <ul className="space-y-3">
            {[
              "抹茶粉一定要过筛，否则容易结块影响口感。",
              "芝士需要提前室温软化，这样搅拌出来的面糊才会细腻。",
              "烘烤时间根据自家烤箱脾气调整，插入牙签带不出湿面糊即可。"
            ].map((tip, idx) => (
              <li key={idx} className="flex space-x-3 text-sm text-gray-600 leading-relaxed">
                <span className="text-primary font-bold">{idx + 1}.</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* User Comments */}
        <div className="mt-10 pt-8 border-t border-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">用户评论 <span className="text-sm font-normal text-gray-400 ml-1">({comments.length})</span></h3>
            <span className="text-xs text-primary font-medium">查看全部</span>
          </div>
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img src={comment.avatar} className="w-8 h-8 rounded-full flex-shrink-0" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-800">{comment.user}</span>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Heart size={12} />
                      <span className="text-[10px]">{comment.likes}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 leading-relaxed">{comment.content}</p>
                  <span className="text-[10px] text-gray-400">{comment.date}</span>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">暂无评论，快来抢沙发吧！</p>
            )}
          </div>
        </div>
      </div>

      {/* Detail Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center space-x-3 z-50 max-w-md mx-auto">
        <form onSubmit={handleSubmitComment} className="flex-1 bg-gray-100 rounded-full px-4 py-1.5 flex items-center">
          <input 
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="说点儿什么吧..."
            className="bg-transparent border-none outline-none text-xs w-full"
          />
          {commentText.trim() && (
            <button 
              type="submit"
              className="ml-2 text-primary text-xs font-bold whitespace-nowrap px-2 py-1"
            >
              发送
            </button>
          )}
        </form>
        <div className="flex items-center space-x-4 text-gray-500">
          <div 
            onClick={() => onToggleFavorite(recipe.id)}
            className="flex items-center space-x-1 cursor-pointer"
          >
            <Heart size={20} fill={isFavorite ? "#FF4D4D" : "none"} color={isFavorite ? "#FF4D4D" : "currentColor"} /> 
            <span className={`text-[10px] ${isFavorite ? 'text-primary' : ''}`}>20w</span>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer"><MessageCircle size={20} /> <span className="text-[10px]">{comments.length}</span></div>
          <div className="flex items-center space-x-1 cursor-pointer"><Plus size={20} /> <span className="text-[10px]">传作品</span></div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activePage, setActivePage] = useState<Page>('home');
  const [prevPage, setPrevPage] = useState<Page>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>(['抹茶', '蛋糕', '减脂']);
  const [commentsMap, setCommentsMap] = useState<Record<number, Comment[]>>({
    1: [
      { id: '1', user: "爱吃肉的小仙女", avatar: "https://picsum.photos/seed/u1/100/100", content: "按照博主的步骤做出来真的太好吃了！抹茶味很浓郁，芝士也很丝滑。", date: "2小时前", likes: 128 },
      { id: '2', user: "厨房小白本人", avatar: "https://picsum.photos/seed/u2/100/100", content: "第一次尝试做蛋糕，竟然成功了！步骤写得很详细，感谢分享！", date: "5小时前", likes: 45 },
    ],
    2: [
      { id: '3', user: "美食家阿强", avatar: "https://picsum.photos/seed/u3/100/100", content: "抹茶粉我换成了五十铃，味道更上一层楼，大家可以试试。", date: "昨天", likes: 89 }
    ]
  });

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setPrevPage(activePage);
    setActivePage('detail');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setPrevPage(activePage);
    setActivePage('productDetail');
  };

  const handleBuyClick = () => {
    if (selectedProduct) {
      setCheckoutItems([{ product: selectedProduct, quantity: 1 }]);
      setPrevPage(activePage);
      setActivePage('checkout');
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Optional: Show feedback
    alert('已加入购物车');
  };

  const updateCartQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const handleCartCheckout = (selectedItems: CartItem[]) => {
    setCheckoutItems(selectedItems);
    setPrevPage(activePage);
    setActivePage('checkout');
  };

  const handleCheckoutSuccess = (itemIds: number[]) => {
    setCart(prev => prev.filter(item => !itemIds.includes(item.product.id)));
  };

  const handleSearchClick = () => {
    setPrevPage(activePage);
    setActivePage('search');
  };

  const handleSearch = (keyword: string) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== keyword);
      return [keyword, ...filtered].slice(0, 10);
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const handleBack = () => {
    setActivePage(prevPage);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const toggleFavoriteProduct = (id: number) => {
    setFavoriteProducts(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const addComment = (recipeId: number, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      user: "叫我小爱",
      avatar: "https://picsum.photos/seed/me/150/150",
      content,
      date: "刚刚",
      likes: 0
    };
    setCommentsMap(prev => ({
      ...prev,
      [recipeId]: [newComment, ...(prev[recipeId] || [])]
    }));
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-bg-gray relative shadow-2xl overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activePage === 'home' && (
            <HomePage 
              onRecipeClick={handleRecipeClick} 
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSearchClick={handleSearchClick}
            />
          )}
          {activePage === 'market' && (
            <MarketPage 
              onProductClick={handleProductClick} 
              cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
              onCartClick={() => {
                setPrevPage(activePage);
                setActivePage('cart');
              }}
            />
          )}
          {activePage === 'video' && <VideoPage />}
          {activePage === 'search' && (
            <SearchPage 
              history={searchHistory}
              onSearch={handleSearch}
              onClearHistory={clearSearchHistory}
              onBack={handleBack}
              onRecipeClick={handleRecipeClick}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          )}
          {activePage === 'cart' && (
            <CartPage 
              cart={cart}
              onBack={handleBack}
              onUpdateQuantity={updateCartQuantity}
              onRemove={removeFromCart}
              onCheckout={handleCartCheckout}
            />
          )}
          {activePage === 'favorite' && (
            <FavoritePage 
              favorites={favorites}
              favoriteProducts={favoriteProducts}
              onRecipeClick={handleRecipeClick}
              onProductClick={handleProductClick}
              onToggleFavorite={toggleFavorite}
              onToggleFavoriteProduct={toggleFavoriteProduct}
            />
          )}
          {activePage === 'profile' && <ProfilePage favoriteCount={favorites.length + favoriteProducts.length} />}
          {activePage === 'detail' && (
            <RecipeDetailPage 
              recipe={selectedRecipe}
              onBack={handleBack} 
              isFavorite={selectedRecipe ? favorites.includes(selectedRecipe.id) : false}
              onToggleFavorite={toggleFavorite}
              comments={selectedRecipe ? (commentsMap[selectedRecipe.id] || []) : []}
              onAddComment={(content) => selectedRecipe && addComment(selectedRecipe.id, content)}
            />
          )}
          {activePage === 'productDetail' && (
            <ProductDetailPage 
              product={selectedProduct}
              onBack={handleBack}
              onBuy={handleBuyClick}
              onAddToCart={handleAddToCart}
              isFavorite={selectedProduct ? favoriteProducts.includes(selectedProduct.id) : false}
              onToggleFavorite={toggleFavoriteProduct}
            />
          )}
          {activePage === 'checkout' && (
            <CheckoutPage 
              items={checkoutItems}
              onBack={() => setActivePage('market')}
              onSuccess={handleCheckoutSuccess}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {!['detail', 'productDetail', 'checkout', 'cart', 'search'].includes(activePage) && (
        <BottomNav activePage={activePage} setActivePage={setActivePage} />
      )}
    </div>
  );
}
