import React from 'react';
import './ProjectFlipCard.css';

interface ProjectFlipCardProps {
  title: string;
  description: string;
  image: string;
}

const ProjectFlipCard: React.FC<ProjectFlipCardProps> = ({ title, description, image }) => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <img src={image} alt={title} className="project-image" />
          <h3 className="project-title">{title}</h3>
        </div>
        <div className="flip-card-back">
          <h3 className="project-title">{title}</h3>
          <p className="project-desc">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectFlipCard;
