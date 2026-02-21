import type { Editor } from '@tiptap/react';
import type { EditorToolbarItemProps } from '../types';

import { useState, useCallback } from 'react';
import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useStorageUpload } from 'src/hooks/firebase/use-storage';

import { editorClasses } from '../classes';
import { ToolbarItem } from './toolbar-item';

// ----------------------------------------------------------------------

type ImageBlockProps = Pick<EditorToolbarItemProps, 'icon'> & {
  editor: Editor;
};

type ImageFormState = {
  imageUrl: string;
  altText: string;
};

export function ImageBlock({ editor, icon }: ImageBlockProps) {
  const { anchorEl, open, onOpen, onClose } = usePopover();
  const { uploadFile, loading } = useStorageUpload('editor_images');
  const [state, setState] = useState<ImageFormState>({
    imageUrl: '',
    altText: '',
  });

  const handleApply = useCallback(() => {
    onClose();
    setState({ imageUrl: '', altText: '' });
    editor.chain().focus().setImage({ src: state.imageUrl, alt: state.altText }).run();
  }, [editor, onClose, state.altText, state.imageUrl]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploaded = await uploadFile(file);
    if (uploaded?.url) {
      editor.chain().focus().setImage({ src: uploaded.url, alt: file.name }).run();
      onClose();
    }
  };

  const popoverId = open ? 'image-popover' : undefined;

  return (
    <>
      <ToolbarItem
        aria-describedby={popoverId}
        aria-label="Insert image"
        className={editorClasses.toolbar.image}
        onClick={onOpen}
        icon={icon}
      />

      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              p: 2.5,
              gap: 1.25,
              width: 1,
              maxWidth: 320,
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Typography variant="subtitle2">Add image</Typography>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          <Button
            variant="outlined"
            component="label"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Uploading...' : 'Upload from computer'}
            <input type="file" hidden accept="image/*" onChange={handleUpload} />
          </Button>

          <Divider sx={{ borderStyle: 'dashed' }}>OR</Divider>

          <TextField
            fullWidth
            size="small"
            placeholder="Image URL"
            value={state.imageUrl}
            onChange={(event) => setState((prev) => ({ ...prev, imageUrl: event.target.value }))}
            disabled={loading}
          />

          <TextField
            fullWidth
            size="small"
            placeholder="Alt text"
            value={state.altText}
            onChange={(event) => setState((prev) => ({ ...prev, altText: event.target.value }))}
            disabled={loading}
          />

          <Button
            variant="contained"
            disabled={!state.imageUrl || loading}
            onClick={handleApply}
            sx={{ alignSelf: 'flex-end' }}
          >
            Apply
          </Button>
        </Box>
      </Popover>
    </>
  );
}
