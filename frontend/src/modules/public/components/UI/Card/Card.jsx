// src/components/UI/Card/Card.jsx
import styles from './Card.module.css';

const Card = ({ 
  children, 
  variant = 'default', 
  hoverable = false, 
  className = '',
  onClick,
  ...props 
}) => {
  const cardClasses = `
    ${styles.card} 
    ${styles[variant]} 
    ${hoverable ? styles.hoverable : ''} 
    ${onClick ? styles.clickable : ''}
    ${className}
  `.trim();

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
