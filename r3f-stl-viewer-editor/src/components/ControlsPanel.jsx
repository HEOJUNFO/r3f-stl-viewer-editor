// ControlsPanel.jsx (예시)
import React from 'react';
import { Box, Slider, Typography, Button } from '@mui/material';

function ControlsPanel({ 
  opacity, setOpacity,
  isMemoMode, setIsMemoMode
}) {

  const handleOpacityChange = (_, newValue) => {
    setOpacity(newValue);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 999,
        p: 2,
        background: 'rgba(0,0,0,0.6)',
        borderRadius: '8px',
        // 버튼이 강조되도록 박스도 약간 부각
      }}
    >
      {/* 투명도 */}
      <Typography variant="body1" color="white" sx={{ mb: 1 }}>
        Opacity
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', width: 200, mb: 2 }}>
        <Slider
          value={opacity}
          onChange={handleOpacityChange}
          min={0}
          max={1}
          step={0.01}
          sx={{
            color: '#ff9800',  // 주황색 톤
            flex: 1,
            mr: 2,
          }}
        />
        <Typography variant="body2" color="white" sx={{ width: 30 }}>
          {opacity.toFixed(2)}
        </Typography>
      </Box>

      {/* 메모 모드 버튼 */}
      <Button
        variant="contained"
        color="secondary" 
        // 색상 테마가 마음에 안 들면 sx로 커스텀할 수 있음
        sx={{
          fontSize: '1rem',
          fontWeight: 'bold',
          width: '200px',         // 버튼 너비 키우기
          backgroundColor: isMemoMode ? '#d32f2f' : '#1976d2', // 예) 빨간색 / 파란색
          ':hover': {
            backgroundColor: isMemoMode ? '#c62828' : '#1565c0'
          },
          // 좀 더 강조하고 싶다면 박스 쉐도우
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          mb: 1,
        }}
        onClick={() => setIsMemoMode(prev => !prev)}
      >
        {isMemoMode ? '메모 종료' : '메모 시작'}
      </Button>
    </Box>
  );
}

export default ControlsPanel;
