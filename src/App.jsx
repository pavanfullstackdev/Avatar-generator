import "remixicon/fonts/remixicon.css";
import "animate.css";
import { useEffect, useState } from "react";
import avatarPlaceholder from './assets/avatar.jpg';
const data = [
  {
    label: "Illustration",
    value: "illustration",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=",
  },
  {
    label: "Adventurer",
    value: "adventurer",
    url: "https://api.dicebear.com/7.x/adventurer/svg?seed=",
  },
  {
    label: "Sketch",
    value: "sketch",
    url: "https://api.dicebear.com/7.x/croodles/svg?seed=",
  },
  {
    label: "Robots",
    value: "robots",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=",
  },
  {
    label: "Pixel",
    value: "pixel",
    url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=",
  },
  {
    label: "Male",
    value: "male",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=male-{id}",
  },
  {
    label: "Female",
    value: "female",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=female-{id}",
  },
];
const App = () => {
  const [src, setSrc] = useState('')
  const [option, setOption] = useState('male')
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteAvatars')
    return saved ? JSON.parse(saved) : []
  })

  const addToFavorites = () => {
    // Check if the URL already exists in favorites
    if (favorites.some(item => item.url === src)) {
      alert('This avatar is already in your favorites!')
      return
    }
    const newFavorite = { url: src, type: option, timestamp: Date.now() }
    const updatedFavorites = [...favorites, newFavorite]
    setFavorites(updatedFavorites)
    localStorage.setItem('favoriteAvatars', JSON.stringify(updatedFavorites))
  }

  const removeFromFavorites = (url) => {
    const updatedFavorites = favorites.filter(item => item.url !== url)
    setFavorites(updatedFavorites)
    localStorage.setItem('favoriteAvatars', JSON.stringify(updatedFavorites))
  }

  const updateStats = () => {
    const newStats = {
      ...stats,
      totalGenerated: stats.totalGenerated + 1,
      categoryUsage: {
        ...stats.categoryUsage,
        [option]: (stats.categoryUsage[option] || 0) + 1
      }
    }
    setStats(newStats)
    localStorage.setItem('avatarStats', JSON.stringify(newStats))
  }

  const generate = () => {
    const srcMatched = data.find((item) => item.value === option)
    const url = srcMatched.url
    const unique = Date.now()
    if (option === "male" || option === 'female') {
      const randomId = Math.floor(Math.random() * 1000)
      const finalUrl = url.replace('{id}', randomId)
      setSrc(finalUrl)
      return
    } else {
      const finalUrl = `${url}${unique}`
      setSrc(finalUrl)
    }
  }

  const onOptionChange = (e) => {
    setOption(e.target.value)
  }

  useEffect(() => {
    generate()
  }, [option])
  return (
    <div className="animate__animated overflow-hidden min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center text-white">
      <div className="animate__animated animate__fadeIn flex flex-col gap-4 items-center w-full max-w-md rounded-2xl shadow-xl backdrop-blur-xl border border-slate-700 p-6">
        <img
          src={src || avatarPlaceholder}
          className="w-24 h-24 rounded-full border-4 border-slate-700 shadow-lg object-cover"
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-wide">Avatar generator</h1>
          <p className="text-base font-normal text-slate-300">Generate Avatars</p>
        </div>
        <div className="w-full space-y-3">
          <select value={option} onChange={onOptionChange} className="w-full rounded-lg p-2 bg-slate-900/60">
            {data &&
              data.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
          </select>

          {/* Favorites */}
          <div className="bg-slate-900/60 rounded-lg p-3">
            <h3 className="text-base font-semibold mb-1">Favorites</h3>
            <div className="flex gap-2 flex-wrap">
              {favorites.map((item, index) => (
                <div key={index} className="relative">
                  <img
                    src={item.url}
                    className="w-8 h-8 rounded-full flex-shrink-0 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => {
                      setSrc(item.url);
                      setOption(item.type);
                    }}
                    alt={`Favorite ${index + 1}`}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromFavorites(item.url);
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full rounded-lg p-2 bg-slate-900/60 break-all text-xs">{src}</div>
        </div>
        <div className="flex flex-wrap w-full gap-2">
          <button onClick={generate} className="flex-1 bg-gradient-to-r from-rose-500 to-orange-400  font-medium rounded-lg p-2 hover:scale-105 transition-transform">
            <i className="ri-arrow-right-up-line mr-1"></i>Generate
          </button>
          <button onClick={() => {
            const link = document.createElement('a');
            link.href = src;
            link.download = `avatar-${Date.now()}.${src.endsWith('.jpg') ? 'jpg' : 'svg'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }} className="flex-1 bg-gradient-to-r from-green-500 to-orange-400  font-medium rounded-lg p-2 hover:scale-105 transition-transform">
            <i className="ri-download-line mr-1"></i>Download
          </button>
          <button onClick={() => {
            navigator.clipboard.writeText(src);
            alert('URL copied to clipboard!');
          }} className="flex-1 bg-gradient-to-r from-pink-500 to-blue-400  font-medium rounded-lg p-2 hover:scale-105 transition-transform">
            <i className="ri-file-copy-line mr-1"></i>Copy
          </button>
          <button onClick={addToFavorites} className="flex-1 bg-gradient-to-r from-yellow-500 to-red-400  font-medium rounded-lg p-2 hover:scale-105 transition-transform">
            <i className="ri-heart-line mr-1"></i>Favorite
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
