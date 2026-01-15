// import React, { useState } from 'react';

// const SearchBar = ({ onSearch }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [showHint, setShowHint] = useState(false);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (onSearch && searchTerm.trim()) {
//       setIsSearching(true);
//       try {
//         await onSearch(searchTerm);
//       } finally {
//         setIsSearching(false);
//       }
//     }
//   };

//   return (
//     <div style={{
//       margin: '2rem 0',
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '0.5rem',
//       padding: '0 20px'
//     }}>
//       <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
//         <input
//           type="text"
//           placeholder="Search: name, brand, 'under 5k', '5000-10000', color, size..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onFocus={() => setShowHint(true)}
//           onBlur={() => setTimeout(() => setShowHint(false), 200)}
//           disabled={isSearching}
//           style={{
//             flex: 1,
//             padding: '0.8rem',
//             border: '1px solid #ddd',
//             borderRadius: '4px',
//             fontSize: '1rem',
//             opacity: isSearching ? 0.6 : 1
//           }}
//         />
//         <button
//           type="submit"
//           disabled={isSearching}
//           style={{
//             padding: '0.8rem 1.5rem',
//             background: isSearching ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: isSearching ? 'not-allowed' : 'pointer',
//             fontWeight: 'bold',
//             whiteSpace: 'nowrap'
//           }}
//         >
//           {isSearching ? '⏳ Searching...' : '🔍 Search'}
//         </button>
//       </form>
      
//       {showHint && (
//         <div style={{
//           fontSize: '0.85rem',
//           color: '#666',
//           padding: '0.5rem',
//           background: '#f5f5f5',
//           borderRadius: '4px',
//           lineHeight: '1.5'
//         }}>
//           <strong>Search tips:</strong> Try "under 5k", "5000-10000", "blue shoes", "size 10", "casual", etc.
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBar;










// import React, { useState } from 'react';

// const SearchBar = ({ onSearch }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showHint, setShowHint] = useState(false);

//   const handleChange = async (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     if (onSearch && value.trim()) {
//       await onSearch(value);
//     }
//   };

//   return (
//     <div style={{
//       margin: '2rem 0',
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '0.5rem',
//       padding: '0 20px'
//     }}>
//       <input
//         type="text"
//         placeholder="Search: name, brand, 'under 5k', color, size..."
//         value={searchTerm}
//         onChange={handleChange}
//         onFocus={() => setShowHint(true)}
//         onBlur={() => setTimeout(() => setShowHint(false), 200)}
//         style={{
//           padding: '0.8rem',
//           border: '1px solid #ddd',
//           borderRadius: '4px',
//           fontSize: '1rem'
//         }}
//       />

//       {showHint && (
//         <div style={{
//           fontSize: '0.85rem',
//           color: '#666',
//           padding: '0.5rem',
//           background: '#f5f5f5',
//           borderRadius: '4px',
//           lineHeight: '1.5'
//         }}>
//           <strong>Search tips:</strong> Try "under 5k", "5000-10000", "blue shoes", "size 10"
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBar;








// import React, { useState, useEffect, useRef } from 'react';

// const SearchBar = ({ value, onSearch }) => {
//   const [input, setInput] = useState(value || '');
//   const isTyping = useRef(false);

//   // Sync with value prop only if user is not typing
//   useEffect(() => {
//     if (!isTyping.current) {
//       setInput(value || '');
//     }
//   }, [value]);

//   // Function to handle search + websocket
//   const triggerSearch = (searchTerm) => {
//     onSearch(searchTerm); // Call parent search callback

//     // Connect WebSocket, send the search, and close
//     const ws = new WebSocket('ws://localhost:8000/ws'); // <-- Replace with your URL

//     ws.onopen = () => {
//       console.log('WebSocket connected, sending search:', searchTerm);
//       ws.send(JSON.stringify({ type: 'search', query: searchTerm }));
//       ws.close(); // Close immediately after sending
//     };

//     ws.onclose = () => {
//       console.log('WebSocket closed after search');
//     };

//     ws.onerror = (err) => {
//       console.error('WebSocket error:', err);
//     };
//   };

//   // Trigger search automatically when input changes (debounced)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       triggerSearch(input);
//       isTyping.current = false; // reset typing after search
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [input]); // removed onSearch dependency to avoid duplicate triggers

//   const handleChange = (e) => {
//     isTyping.current = true; // user is typing
//     setInput(e.target.value);
//   };

//   return (
//     <div style={{ display: 'flex', margin: '20px', alignItems: 'center' }}>
//       <input
//         type="text"
//         value={input}
//         onChange={handleChange}
//         placeholder="Search products..."
//         style={{
//           flex: 1,
//           padding: '10px 12px',
//           fontSize: '16px',
//           border: '2px solid #000',
//           borderRadius: '6px',
//           outline: 'none',
//           transition: 'border-color 0.2s',
//         }}
//         onFocus={(e) => (e.target.style.borderColor = '#007BFF')}
//         onBlur={(e) => (e.target.style.borderColor = '#000')}
//       />
//       <button
//         onClick={() => triggerSearch(input)}
//         style={{
//           padding: '10px 18px',
//           marginLeft: '10px',
//           fontSize: '16px',
//           backgroundColor: '#007BFF',
//           color: '#fff',
//           border: 'none',
//           borderRadius: '6px',
//           cursor: 'pointer',
//           transition: 'background-color 0.2s',
//         }}
//         onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
//         onMouseLeave={(e) => (e.target.style.backgroundColor = '#007BFF')}
//       >
//         Search
//       </button>
//     </div>
//   );
// };

// export default SearchBar;







import React, { useState, useEffect } from 'react';

const SearchBar = ({ value, onSearch }) => {
  const [input, setInput] = useState(value || '');

  // ✅ ALWAYS sync input when parent value changes (AUTOFILL FIX)
  useEffect(() => {
    setInput(value || '');
  }, [value]);

  // ✅ Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) {
        triggerSearch(input);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  // ✅ Search + WebSocket
  const triggerSearch = (searchTerm) => {
    onSearch(searchTerm);

    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'search',
          query: searchTerm,
        })
      );

      // small delay = safer delivery
      setTimeout(() => ws.close(), 50);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  };

  return (
    <div style={{ display: 'flex', margin: '20px', alignItems: 'center' }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search products..."
        style={{
          flex: 1,
          padding: '10px 12px',
          fontSize: '16px',
          border: '2px solid #000',
          borderRadius: '6px',
          outline: 'none',
        }}
      />

      <button
        onClick={() => triggerSearch(input)}
        style={{
          padding: '10px 18px',
          marginLeft: '10px',
          fontSize: '16px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
