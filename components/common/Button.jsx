import React from 'react';

// variant - outlined , contained
const Button = ({
  children,
  onClick,
  fullWidth,
  variant,
  style,
  className,
  disabled,
  ...otherProps
}) => {
  let classes = 'btn btn-primary ';
  if (className) classes += `${className} `;
  if (variant === 'contained') classes += 'contained-button ';
  if (variant === 'outlined') classes += 'outlined-button ';
  if (variant === 'danger') classes += 'delete-button ';
  if (variant === undefined) classes += 'contained-button ';
  if (fullWidth) classes += 'w-100 ';

  return (
    <button
      onClick={onClick}
      style={style}
      type="button"
      {...otherProps}
      className={classes}
      disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
