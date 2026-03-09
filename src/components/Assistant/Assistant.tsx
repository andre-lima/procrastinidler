import './styles.scss';

export const Assistant = ({ id }: { id: string }) => {
  return (
    <div className="assistantImage navBarImage">
      <img src={'assistants/' + id + '.png'} alt={'assistant image'} />
    </div>
  );
};

// useEffect(() => {
//   const timer = new IntervalController(() => {
//     dispatch({ type: GUIActions.GENERATE_GENERATORS });
//   }, tickLength);

//   if (!gameStatus.playedCoupDeGrace) {
//     timer.start();
//   }

//   on(GameplayEvents.WAIT_FOR_LAST_HIT, () => {
//     timer.stop();
//   });

//   return () => {
//     timer.stop();
//   };
// }, [tickLength]);
