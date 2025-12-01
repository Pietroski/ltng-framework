export const stories = {};

export function registerStory(name, description, renderFn) {
    stories[name] = {
        name,
        description,
        render: renderFn
    };
}
