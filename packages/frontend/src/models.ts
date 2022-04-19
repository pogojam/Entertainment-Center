import { types } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { NavModel } from './components/nav';

///////////////// SCENE1 
export const AnimModel = types
    .model({
        entranceAnim: types.optional(types.boolean, false),
        mSize: types.optional(types.number, .4),
        mouse: types.optional(types.array(types.number), [0, 1]),
        intensity: types.optional(types.number, .4),
        mouseLock: types.optional(types.boolean, false),
    })
    .actions((self) => ({
        playEntrance(state) {
            self.entranceAnim = state
        },
        setMSize(s) {
            self.mSize = s
        },
        setIntensity(i) {
            self.intensity = i
        },
        setMouse(m) {
            self.mouse = m
        }
        , setMouseLock(state) {
            self.mouseLock = state
        }
    }));

///////////////// SCENE1 
export const Scene1Model = types
    .model({
        bottomOfHeading: types.optional(types.number, 0),
    })
    .actions((self) => ({
        setBottomOfHeading(pos) {
            self.bottomOfHeading = pos;
        },
    }));


// Init store root models.
let initStore = {
    NavStore: NavModel.create(),
    Scene1Store: Scene1Model.create(),
    AnimStore: AnimModel.create()

};
// Create store instance.
// type StoreType = Instance<typeof RootStore>;
export const createStore = () => initStore;
export const store = createStore();

/**
 * Create context for store.
 * @hidden
 */
export const ModelContext = createContext(store);
/**
 * @hidden
 */
export const useStore = () => useContext(ModelContext);
