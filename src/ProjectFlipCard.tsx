import React from 'react';
import './ProjectFlipCard.css';

interface ProjectFlipCardProps {
  title: string;
  description: string;
  image: string;
  link?: string;
  onClick?: () => void;
}

const ProjectFlipCard: React.FC<ProjectFlipCardProps> = ({ title, description, image, onClick, link}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      window.open(link, '_blank');
    }
  };

  
  return (
    <div className="project-card widget" onClick={handleClick}>
      <img src={image} alt={title} className="project-image" />
      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
      </div>
      
      {/* Styles moved to ProjectFlipCard.css */}
    </div>
  );
};

export default ProjectFlipCard;
