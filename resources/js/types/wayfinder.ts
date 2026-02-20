import type {
    RouteDefinition,
    RouteFormDefinition,
    RouteQueryOptions,
} from '@/wayfinder';

type RouteMethod =
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'patch'
    | 'head'
    | 'options';

export type RouteByMethodFn<TMethod extends RouteMethod> = {
    (options?: RouteQueryOptions): RouteDefinition<TMethod>;
    url: (options?: RouteQueryOptions) => string;
    form: (options?: RouteQueryOptions) => RouteFormDefinition<TMethod>;
};

export type RouteFn = {
    (options?: RouteQueryOptions): RouteDefinition<'get'>;
    url: (options?: RouteQueryOptions) => string;
    form: (options?: RouteQueryOptions) => RouteFormDefinition<'get'>;
};

export type RouteMutationFn = RouteByMethodFn<'post'>;
