// MemoManager.jsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField,
  DialogContentText
} from '@mui/material';

function MemoManager({
  newMemoDialogOpen,
  setNewMemoDialogOpen,
  newMemoPosition,
  setNewMemoPosition,
  memos,
  setMemos,

  // 수정/삭제
  editDialogOpen,
  setEditDialogOpen,
  selectedMemoIndex,
  setSelectedMemoIndex,
  editText,
  setEditText,
}) {
  // 새 메모 다이얼로그 닫기
  const handleCloseNewMemoDialog = () => {
    setNewMemoDialogOpen(false);
    setNewMemoText('');  // <- 만약 새로운 state로 관리하려면 필요
    setNewMemoPosition([0, 0, 0]);
  };

  // "새 메모 작성" 시 내용은 별도 state로 관리하거나, 
  // parent에서만 관리해도 됨. 여기서는 parent에서 안 하므로 지역 변수를 쓸 수도 있음.
  // 다만, 질문 코드에서는 한 파일에 모두 있었기에... 
  // 지금은 newMemoText라는 state가 필요. 일단 간단히 만든다고 가정:

  const [newMemoText, setNewMemoText] = React.useState('');

  React.useEffect(() => {
    // 다이얼로그가 열릴 때 newMemoText를 초기화
    if (newMemoDialogOpen) {
      setNewMemoText(''); 
    }
  }, [newMemoDialogOpen]);

  const handleSaveNewMemo = () => {
    if (!newMemoText.trim()) {
      alert('메모 내용을 입력하세요!');
      return;
    }
    setMemos(prev => [...prev, { position: newMemoPosition, text: newMemoText }]);
    handleCloseNewMemoDialog();
  };

  // 수정/삭제 다이얼로그
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedMemoIndex(null);
  };

  const handleEditSave = () => {
    if (selectedMemoIndex === null) return;
    setMemos(prev =>
      prev.map((memo, i) =>
        i === selectedMemoIndex ? { ...memo, text: editText } : memo
      )
    );
    setEditDialogOpen(false);
    setSelectedMemoIndex(null);
  };

  const handleDeleteMemo = () => {
    if (selectedMemoIndex === null) return;
    const sure = window.confirm('정말 삭제하시겠습니까?');
    if (!sure) return;
    setMemos(prev => prev.filter((_, i) => i !== selectedMemoIndex));
    setEditDialogOpen(false);
    setSelectedMemoIndex(null);
  };

  return (
    <>
      {/* --- 새 메모 작성 다이얼로그 --- */}
      <Dialog open={newMemoDialogOpen} onClose={handleCloseNewMemoDialog}>
        <DialogTitle>새 메모 작성</DialogTitle>
        <DialogContent>
          <TextField
            label="메모 내용"
            value={newMemoText}
            onChange={(e) => setNewMemoText(e.target.value)}
            multiline
            rows={3}
            autoFocus
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewMemoDialog}>취소</Button>
          <Button variant="contained" onClick={handleSaveNewMemo}>저장</Button>
        </DialogActions>
      </Dialog>

      {/* --- 수정/삭제 다이얼로그 --- */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>메모 수정 / 삭제</DialogTitle>
        <DialogContent>
          <TextField
            label="메모 내용"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            multiline
            rows={3}
            autoFocus
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleDeleteMemo}>삭제</Button>
          <Button onClick={handleCloseEditDialog}>취소</Button>
          <Button variant="contained" onClick={handleEditSave}>저장</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MemoManager;

