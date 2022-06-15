import axios from 'axios';

/**
 * Adds an "id" property to a list of objects, copied from another property, to pacify React.
 * Using a function like this works for any list of React components, but some MUI components have 
 * a handy prop to translate ids: https://mui.com/x/react-data-grid/rows/#feeding-data
 * @param objectsWithOtherwiseNamedIds list of objects with some other property not called "id" that can be used as an id
 * @param idPropertyName name of the property to use for the React "id" property
 */
export const addReactIds = (objectsWithOtherwiseNamedIds, idPropertyName) => {
  const objectsWithReactIds = [];

  for (const currentObject of objectsWithOtherwiseNamedIds) {
    const currentObjectCopy = {...currentObject};
    currentObjectCopy.id = currentObjectCopy[idPropertyName];
    objectsWithReactIds.push(currentObjectCopy);
  }
  
  return objectsWithReactIds;
};


export const getNewTableData = async (apiUrl) => {
  const res = await axios.get(apiUrl);
  
  return res.data;
}
