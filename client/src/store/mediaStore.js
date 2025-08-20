import {create} from 'zustand';

export const useMediaStore =  create((set) => ({
    media: [
        {title: '', type: 'anime'},
        {title: '', type: 'movie'},
        {title: '', type: 'tv'},
    ],
    setMedia: (index, key, value) =>
        set((state) => {
            const updated =[...state.media];
            updated[index][key] = value;
            return { media: updated};
        }),
        resetMedia: ()=>
            set({
                media: [
                     {title: '', type: 'anime'},
                     {title: '', type: 'movie'},
                     {title: '', type: 'tv'},
                ],
            }),

}));
