import { Routes, Route } from 'react-router-dom';
import {
  Home, Users
} from './Pages';

const ExampleRouteComponent = () => {
  // This object of routes can be flattened into an array 
  // if the below .map call in Routes is adjusted
  const routes = {
    priorityNavOptions: [
      { url: '', component: Home, displayName: 'Home Page' }
    ],
    commonNavOptions: [
      { url: 'users', component: Users, displayName: 'Users' },
    ]
  };

  return (
    <main>
      <header>
        <h1>
          ExampleRouteComponent served from ExampleRoute/index.js.

          Try navigating to exampleroute/users.
        </h1>
      </header>

      <Routes>
        {Object.values(routes)
          .flat()
          .map(r =>
            r.component ? (
              <Route exact path={r.url} element={<r.component />} key={r.url} />
            ) : (
              <></>
            )
          )}
      </Routes>
    </main>
  );
};

export default ExampleRouteComponent;
