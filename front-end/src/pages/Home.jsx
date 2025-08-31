import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaTasks, FaGamepad, FaChartLine } from 'react-icons/fa';
import '../css/Home.css';

function Home() {
  const features = [
    {
      icon: <FaUsers />,
      title: 'Create Your Team',
      description: 'Join your flat with a unique group code and unlock your shared space as a team.',
    },
    {
      icon: <FaTasks />,
      title: 'Shared & Personal Lists',
      description: 'Know what needs doing with a shared to-do list, and stay on top of your own responsibilities.',
    },
    {
      icon: <FaGamepad />,
      title: 'Gamified Dispute Resolution',
      description: "Can't agree who takes the bins out? Let a fun and fair mini-game decide for you.",
    },
    {
      icon: <FaChartLine />,
      title: 'Level Up Your Flat',
      description: 'Earn rewards, complete quests together, and become the ultimate flatmate squad.',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Turn Flat Chores into Epic Quests</h1>
          <p className="hero-subtitle">
            FlatQuest makes shared living simple, fun, and fair. Organise tasks, resolve disputes, and level up your teamwork.
          </p>
          <Link to="/register" className="cta-button">
            Start Your Quest for Free!
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* "Why FlatQuest?" Section */}
      <section className="why-section">
        <div className="why-content">
          <h2 className="section-title">No More Passive-Aggressive Sticky Notes</h2>
          <p className="why-description">
            Say goodbye to forgotten chores and silent stand-offs. FlatQuest brings transparency, accountability, and a touch of fun to your shared home.
          </p>
          <div className="tagline">
            <h4>Teamwork. Gamified. Simplified.</h4>
          </div>
          <Link to="/register" className="cta-button-secondary">
            Create Your Account Today
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;


// import "../css/Home.css";
// import { Link } from "react-router-dom";

// function Home() {

//     return (
//         <div className="home">
//             <h1>🏠 Welcome to FlatQuest!</h1>
//             <br></br>
//             <h3>Turn flat chores into epic quests.</h3>
//             <p className="home-p">
//                 FlatQuest makes shared living simple, fun, and fair.<br></br>
//                 Whether you're in a student flat, shared house, or co-living space, we help you and your flatmates stay organised—and maybe even enjoy doing chores.
//             </p><br></br>
//             <h3>How it works:</h3>
//                 <ul>
//                     <li>Join your flat with a <strong>group code</strong> and unlock your shared space as a team.</li>
//                     <li>Assign a <strong>Flat Leader</strong> to help organise tasks and keep things moving.</li>
//                     <li><strong>Shared To-Do List</strong> – Know what needs doing and who’s doing it.</li>
//                     <li><strong>Personal To-Do List</strong> – Stay on top of your own responsibilities.</li>
//                     <li><strong>Solve Disputes with Games</strong> – Can't agree who should take the bins out? Let a game decide!</li>
//                     <li><strong>Level Up Your Flat</strong> – Earn rewards, complete quests, and become the ultimate flatmate squad.</li>
//                 </ul>
//             <br></br>
//             <h3>Why FlatQuest?</h3>
//             <p className="home-p">
//                 No more passive-aggressive sticky notes. <br></br>
//                 No more forgotten chores. <br></br>
//                 Just teamwork, transparency, and a touch of fun.<br></br><br></br>
//                 <Link to="/register" className="link-btn">Create your FlatQuest account today</Link>  and turn everyday chores into epic wins.
//                 <br></br>
//             </p><br></br>
//             <h4>Teamwork. Gamified. Simplified.</h4>
//         </div>
//     )
// }

// export default Home;