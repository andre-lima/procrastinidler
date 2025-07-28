export const Assistant = () => {
  const clickToFind = () => {
    const elements = document.querySelectorAll('.todoCard');

    const clickThis = elements[0] as HTMLDivElement;
    clickThis.click();
  };

  return <div onClick={clickToFind}>assistant</div>;
};
