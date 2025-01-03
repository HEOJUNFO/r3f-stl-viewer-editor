// SculptPanel.jsx
import React from 'react';
import { 
  Box, Typography, Slider, 
  ToggleButtonGroup, ToggleButton,
  Button
} from '@mui/material';

function SculptPanel({
  isSculptMode, setIsSculptMode,
  brushSize, setBrushSize,
  intensity, setIntensity,
  sculptMode, setSculptMode,
  onApplySculpt,
  onCancelSculpt,
}) {
  const handleBrushSizeChange = (event, newValue) => {
    setBrushSize(newValue);
  };
  const handleIntensityChange = (event, newValue) => {
    setIntensity(newValue);
  };
  const toggleSculptMode = () => {
    setIsSculptMode(!isSculptMode);
  };

  // "Push / Pull / Smooth / Flatten" 2x2
  const handleSculptModeChange = (event, newMode) => {
    if (newMode !== null) {
      setSculptMode(newMode);
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 999,
        width: 220,
        p: 2,
        background: 'rgba(0,0,0,0.7)',
        borderRadius: '8px',
      }}
    >
      <Typography variant="h6" color="white" sx={{ mb: 1 }}>
        Sculpt
      </Typography>
      
      <Button
        variant={isSculptMode ? 'contained' : 'outlined'}
        color="secondary"
        fullWidth
        sx={{ mb: 2 }}
        onClick={toggleSculptMode}
      >
        {isSculptMode ? 'Sculpt 모드 종료' : 'Sculpt 모드 시작'}
      </Button>

      {/* 브러시 크기 */}
      <Typography variant="body2" color="white" sx={{ mb: 1 }}>
        Brush Size ({brushSize})
      </Typography>
      <Slider
        value={brushSize}
        onChange={handleBrushSizeChange}
        min={1}
        max={100}
        step={1}
        sx={{ color: '#ff9800', mb: 2 }}
      />

      {/* 강도 */}
      <Typography variant="body2" color="white" sx={{ mb: 1 }}>
        Intensity ({intensity.toFixed(1)})
      </Typography>
      <Slider
        value={intensity}
        onChange={handleIntensityChange}
        min={0}
        max={1}
        step={0.1}
        sx={{ color: '#ff9800', mb: 2 }}
      />

      {/* 2x2 버튼 */}
      <ToggleButtonGroup
        color="primary"
        value={sculptMode}
        exclusive
        onChange={handleSculptModeChange}
        // flexWrap 설정으로 자동 줄바꿈
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          mb: 2,
        }}
      >
        <ToggleButton value="pull" sx={{ width: '50%' }}>Pull</ToggleButton>
        <ToggleButton value="push" sx={{ width: '50%' }}>Push</ToggleButton>
        <ToggleButton value="smooth" sx={{ width: '50%' }}>Smooth</ToggleButton>
        <ToggleButton value="flatten" sx={{ width: '50%' }}>Flatten</ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" color="inherit" onClick={onCancelSculpt}>
          취소
        </Button>
        <Button variant="contained" color="primary" onClick={onApplySculpt}>
          적용
        </Button>
      </Box>
    </Box>
  );
}

export default SculptPanel;
