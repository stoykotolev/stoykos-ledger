import { useEffect, useState } from 'react';

const text = 'Stoyko\'s Dossier';

type LoaderType = {
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>
};
const Loader = ({ setLoadingState }:LoaderType) => {
  const [loaderText, setLoaderText] = useState<string>('');
  const [elementClass, setElementClass] = useState<string>('');

  useEffect(() => {
    const finishedText = text.slice(0, loaderText.length + 1);

    if (finishedText === loaderText) {
      setElementClass('animation');
      setTimeout(() => {
        setLoadingState(false);
      }, 3000);
    }
    setTimeout(() => {
      setLoaderText(text.slice(0, loaderText.length + 1));
    }, 200);
  }, [loaderText]);
  return (
    <div id='loader-container'>
      <div className={`loader-text ${elementClass}`}>
        {loaderText}
        <span>&#95;</span>
      </div>
    </div>
  );
};

export default Loader;
