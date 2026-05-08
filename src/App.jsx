import { useRights } from './context/UserRightsContext';

// Sa loob ng component:
const { rights } = useRights();

// Halimbawa sa Add button:
{rights.PRD_ADD === 1 && <button>Add Product</button>}

// Halimbawa sa Delete button (dapat hidden ito base sa SQL natin kanina):
{rights.PRD_DEL === 1 && <button>Delete</button>}