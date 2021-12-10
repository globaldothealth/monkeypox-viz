import { configureStore, combineReducers } from '@reduxjs/toolkit';

import appReducer from './App/slice';
import variantsViewReducer from './VariantsView/slice';
import regionalViewReducer from './RegionalView/slice';

export const rootReducer = combineReducers({
    app: appReducer,
    variantsView: variantsViewReducer,
    regionalView: regionalViewReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
