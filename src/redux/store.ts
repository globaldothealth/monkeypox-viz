import { configureStore, combineReducers } from '@reduxjs/toolkit';

import appReducer from './App/slice';
import chartViewReducer from './ChartView/slice';

export const rootReducer = combineReducers({
    app: appReducer,
    chartView: chartViewReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
