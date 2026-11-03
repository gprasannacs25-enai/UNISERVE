import { useApp } from '../../context/AppContext';
import { Card, PageHead, Empty } from '../../components/ui';
import { timeAgo } from '../../data/bmsce';

export default function Notifications() {
  const { notifications, markAllRead } = useApp();
  return (
    <>
      <PageHead title="Notifications">
        <button className="btn" onClick={markAllRead}>Mark all read</button>
      </PageHead>
      <Card flush className="list">
        {notifications.length === 0 ? <Empty text="You are all caught up." /> : notifications.map((n) => (
          <div className="item" key={n.id}>
            <span className="status-dot" style={{ background: n.read ? 'transparent' : 'var(--accent)' }} />
            <div className="grow">
              <div style={{ fontWeight: n.read ? 400 : 500 }}>{n.text}</div>
              <div className="small faint">{timeAgo(n.at)}</div>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
