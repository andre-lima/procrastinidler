import './events-log.scss';
import { useTranslation } from 'react-i18next';
import { WindowContainer } from '../ui';
import { ScrollArea } from '../shared';
import { useEventsStore, type GameEventKey } from '../../store/eventsStore';

function EventLine({ event }: { event: { id: string; key: GameEventKey; params?: Record<string, number | string> } }) {
  const { t } = useTranslation('events');
  const text = t(event.key, event.params ?? {});
  return (
    <div className="eventsLog_line" key={event.id}>
      &gt; {text}
    </div>
  );
}

export function EventsLog() {
  const { t } = useTranslation('events');
  const events = useEventsStore((state) => state.events);

  return (
    <WindowContainer variant="secondary" title={t('title')} className="eventsLog">
      <ScrollArea maxHeight="100%">
        <div className="eventsLog_list">
          {events.length === 0 ? (
            <div className="eventsLog_line eventsLog_line--empty">&gt; </div>
          ) : (
            events.map((event) => <EventLine key={event.id} event={event} />)
          )}
        </div>
      </ScrollArea>
    </WindowContainer>
  );
}
