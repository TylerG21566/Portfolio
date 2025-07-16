import React from 'react';
import ProjectFlipCard from './ProjectFlipCard';
import './ProjectFlipCardGrid.css';

interface Project {
  title: string;
  description: string;
  image: string;
}

interface ProjectFlipCardGridProps {
  projects: Project[];
}

const ProjectFlipCardGrid: React.FC<ProjectFlipCardGridProps> = ({ projects }) => {
  return (
    <div className="flip-card-grid">
      {projects.map((project, idx) => (
        <ProjectFlipCard
          key={idx}
          title={project.title}
          description={project.description}
          image={project.image}
        />
      ))}
    </div>
  );
};

export default ProjectFlipCardGrid;
