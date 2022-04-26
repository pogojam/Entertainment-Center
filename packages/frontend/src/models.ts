import { types } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { NavModel } from './components/nav';
import projectsConst from './containers/home/scene/projects/projects.const';


const hexToRgbA = (hex) => {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split("");
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = "0x" + c.join("");
        c = [(c >> 16) & 255, (c >> 8) & 255, c & 255];
        c = c.map((u) => u / 255);
        c.push(.3);
        return c;
    }
    throw new Error("Bad Hex");
};

///////////////// SCENE1 
export const AnimModel = types
    .model({
        entranceAnim: types.optional(types.boolean, false),
        mSize: types.optional(types.number, .4),
        mouse: types.optional(types.array(types.number), [0, 1]),
        intensity: types.optional(types.number, .4),
        mouseLock: types.optional(types.boolean, false),
        activeIndex: types.optional(types.number, 0),
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
        },
        setMouseLock(state) {
            self.mouseLock = state
        },
        setActiveIndex(i) {
            self.activeIndex = i
        }
    })).views((self) => ({
        get orbColor() {
            // if (self.activeIndex === 0) {
            //     return [0, 0, 0, 0]
            // }
            return hexToRgbA(projectsConst[self.activeIndex].color)
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
