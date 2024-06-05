import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Import CSS file for styling

// const Navbar=()=>{
//     return (    
//         <div className='navBar'>
//             <div className='stocks'>
//                 <Link to="/">Stocks</Link>
//             </div>
//             <div className='favourites'>
//                 <Link to="/favourites">Favourite</Link>
//         </div>
//             <div className='cart'>
//                 <Link to="/cart">Cart</Link>
//             </div>
//         </div>
//     )

// }

// const NavBar = () => {
//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <div className="logo">
//           <Link to="/">
//             <img src="logo.png" alt="Blog Logo" />
//           </Link>
//         </div>
//         <Link to="/" className="navbar-logo">
//           Pet fAInder
//         </Link>
//         <ul className="nav-menu">
//           <li className="nav-item">
//             <Link to="/" className="nav-links">
//               Search missing pets
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/search_found" className="nav-links">
//               Search found pets
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/add_found_pet" className="nav-links">
//               Add found pet
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/add_missing_pet" className="nav-links">
//               Add missing pet
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/search_by_location" className="nav-links">
//               Search using location
//             </Link>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

const NavBar = () => {
  return (
    <header>
      <div className="logo">
        <Link to="/">
          <img src="logo2.png" alt="Blog Logo" />
        </Link>
        <h2>All you need to help a pet</h2>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/" >
              Search missing pets
            </Link>
          </li>
          <li>
            <Link to="/search_found" >
              Search found pets
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/add_found_pet" className="nav-links">
              Add found pet
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/add_missing_pet" className="nav-links">
              Add missing pet
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link to="/search_by_location" className="nav-links">
              Search using location
            </Link>
          </li> */}
        </ul>
      </nav>
    </header>
  );
};


export default NavBar;