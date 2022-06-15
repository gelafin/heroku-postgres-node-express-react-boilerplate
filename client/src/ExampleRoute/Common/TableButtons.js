import { Button } from '@mui/material';

const TableButtons = ({ onEditClick, onDeleteClick }) => (
  <>
    {onEditClick && (
      <Button variant="contained" color="primary" onClick={onEditClick} style={{ marginRight: 15 }}>
        Edit
      </Button>
    )}
    {onDeleteClick && (
      <Button variant="contained" color="primary" onClick={onDeleteClick}>
        Delete
      </Button>
    )}
  </>
);

export default TableButtons;
