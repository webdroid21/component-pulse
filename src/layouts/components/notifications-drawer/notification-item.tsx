import type { NotificationRecord } from 'src/hooks/firebase';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import SvgIcon from '@mui/material/SvgIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { useRouter } from 'src/routes/hooks';

import { fToNow } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { notificationIcons } from './icons';

// ----------------------------------------------------------------------

export type NotificationItemProps = {
  notification: NotificationRecord;
  onRead: (id: string) => void;
  onClose: () => void;
};

const readerContent = (data: string) => (
  <Box
    dangerouslySetInnerHTML={{ __html: data }}
    sx={{
      '& p': { m: 0, typography: 'body2' },
      '& a': { color: 'inherit', textDecoration: 'none' },
      '& strong': { typography: 'subtitle2' },
    }}
  />
);

const renderIcon = (type: string) =>
  ({
    order: notificationIcons.order,
    chat: notificationIcons.chat,
    mail: notificationIcons.mail,
    delivery: notificationIcons.delivery,
    training: notificationIcons.mail,
  })[type];

// ----------------------------------------------------------------------

export function NotificationItem({ notification, onRead, onClose }: NotificationItemProps) {
  const router = useRouter();

  const handleClick = () => {
    if (notification.isUnRead) {
      onRead(notification.id);
    }
    if (notification.link) {
      onClose();
      router.push(notification.link);
    }
  };

  // ── Avatar ──────────────────────────────────────────────────────────
  const renderAvatar = () => (
    <ListItemAvatar>
      {notification.avatarUrl ? (
        <Avatar src={notification.avatarUrl} sx={{ bgcolor: 'background.neutral' }} />
      ) : (
        <Box
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.neutral',
          }}
        >
          <SvgIcon sx={{ width: 24, height: 24 }}>{renderIcon(notification.type)}</SvgIcon>
        </Box>
      )}
    </ListItemAvatar>
  );

  // ── Text ─────────────────────────────────────────────────────────────
  const renderText = () => (
    <ListItemText
      primary={readerContent(notification.title)}
      secondary={
        <>
          {fToNow(notification.createdAt)}
          <Box
            component="span"
            sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor' }}
          />
          {notification.category}
        </>
      }
      slotProps={{
        primary: { sx: { mb: 0.5 } },
        secondary: {
          sx: {
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            typography: 'caption',
            color: 'text.disabled',
          },
        },
      }}
    />
  );

  // ── Unread badge ──────────────────────────────────────────────────────
  const renderUnReadBadge = () =>
    notification.isUnRead && (
      <Box
        sx={{
          top: 26,
          width: 8,
          height: 8,
          right: 20,
          borderRadius: '50%',
          bgcolor: 'info.main',
          position: 'absolute',
        }}
      />
    );

  // ── Contextual actions ────────────────────────────────────────────────
  const renderOrderAction = () => (
    <Box sx={{ gap: 1, mt: 1.5, display: 'flex' }}>
      {notification.link && (
        <Button
          size="small"
          variant="contained"
          startIcon={<Iconify icon="solar:eye-bold" />}
          onClick={(e) => {
            e.stopPropagation();
            onRead(notification.id);
            onClose();
            router.push(notification.link!);
          }}
        >
          View Order
        </Button>
      )}
    </Box>
  );

  const renderDeliveryAction = () => (
    <Box sx={{ gap: 1, mt: 1.5, display: 'flex' }}>
      <Button
        size="small"
        variant="contained"
        color="primary"
        startIcon={<Iconify icon="solar:delivery-bold" />}
        onClick={(e) => {
          e.stopPropagation();
          onRead(notification.id);
          onClose();
          router.push(notification.link || '/track-order');
        }}
      >
        Track Order
      </Button>
    </Box>
  );

  const renderTrainingAction = () => (
    <Box sx={{ gap: 1, mt: 1.5, display: 'flex' }}>
      {notification.link && (
        <Button
          size="small"
          variant="contained"
          color="secondary"
          startIcon={<Iconify icon="solar:book-bold" />}
          onClick={(e) => {
            e.stopPropagation();
            onRead(notification.id);
            onClose();
            router.push(notification.link!);
          }}
        >
          View Training
        </Button>
      )}
    </Box>
  );

  const renderPaymentAction = () => (
    <Box sx={{ gap: 1, mt: 1.5, display: 'flex' }}>
      {notification.link ? (
        <Button
          size="small"
          variant="contained"
          startIcon={<Iconify icon="solar:card-bold" />}
          onClick={(e) => {
            e.stopPropagation();
            onRead(notification.id);
            onClose();
            router.push(notification.link!);
          }}
        >
          View Details
        </Button>
      ) : (
        <Chip size="small" label="Payment Received" color="success" variant="soft" />
      )}
    </Box>
  );

  const renderAction = () => {
    switch (notification.type) {
      case 'order':
        return renderOrderAction();
      case 'delivery':
        return renderDeliveryAction();
      case 'training':
        return renderTrainingAction();
      case 'payment':
        return renderPaymentAction();
      default:
        return null;
    }
  };

  return (
    <ListItemButton
      onClick={handleClick}
      sx={[
        (theme) => ({
          p: 2.5,
          alignItems: 'flex-start',
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
          cursor: notification.link ? 'pointer' : 'default',
          '&:hover': {
            bgcolor: notification.link ? 'action.hover' : 'transparent',
          },
        }),
      ]}
    >
      {renderUnReadBadge()}
      {renderAvatar()}

      <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
        {renderText()}
        {renderAction()}
      </Box>
    </ListItemButton>
  );
}
