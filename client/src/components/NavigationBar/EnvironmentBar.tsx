import * as React from 'react';
import { useWindowDimensions } from 'hooks/WindowHooks';

export const EnvironmentInfoBar: React.FC = () => {
  const mode = window.location.origin.replace(/(^\w+:|^)\/\//, '');

  const { xs, sm, md, lg, xl } = useWindowDimensions();
  const windowSize = xs ? 'xs' : sm ? 'sm' : md ? 'md' : lg ? 'lg' : xl ? 'xl' : 'unknown';

  if (mode !== 'yukon.ca') {
    return (
      <div className={'terminal-mode-container'}>
        <div className='terminal-mode'>
          {mode} {windowSize}
        </div>
      </div>
    );
  } else {
    return null;
  }
};
