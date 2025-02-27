/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as OnboardingRouteImport } from './routes/onboarding/route'
import { Route as WithonboardingRouteImport } from './routes/_with_onboarding/route'
import { Route as IndexImport } from './routes/index'
import { Route as WithonboardingDashboardRouteImport } from './routes/_with_onboarding/dashboard/route'

// Create/Update Routes

const OnboardingRouteRoute = OnboardingRouteImport.update({
  id: '/onboarding',
  path: '/onboarding',
  getParentRoute: () => rootRoute,
} as any)

const WithonboardingRouteRoute = WithonboardingRouteImport.update({
  id: '/_with_onboarding',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const WithonboardingDashboardRouteRoute =
  WithonboardingDashboardRouteImport.update({
    id: '/dashboard',
    path: '/dashboard',
    getParentRoute: () => WithonboardingRouteRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_with_onboarding': {
      id: '/_with_onboarding'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof WithonboardingRouteImport
      parentRoute: typeof rootRoute
    }
    '/onboarding': {
      id: '/onboarding'
      path: '/onboarding'
      fullPath: '/onboarding'
      preLoaderRoute: typeof OnboardingRouteImport
      parentRoute: typeof rootRoute
    }
    '/_with_onboarding/dashboard': {
      id: '/_with_onboarding/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof WithonboardingDashboardRouteImport
      parentRoute: typeof WithonboardingRouteImport
    }
  }
}

// Create and export the route tree

interface WithonboardingRouteRouteChildren {
  WithonboardingDashboardRouteRoute: typeof WithonboardingDashboardRouteRoute
}

const WithonboardingRouteRouteChildren: WithonboardingRouteRouteChildren = {
  WithonboardingDashboardRouteRoute: WithonboardingDashboardRouteRoute,
}

const WithonboardingRouteRouteWithChildren =
  WithonboardingRouteRoute._addFileChildren(WithonboardingRouteRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof WithonboardingRouteRouteWithChildren
  '/onboarding': typeof OnboardingRouteRoute
  '/dashboard': typeof WithonboardingDashboardRouteRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof WithonboardingRouteRouteWithChildren
  '/onboarding': typeof OnboardingRouteRoute
  '/dashboard': typeof WithonboardingDashboardRouteRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_with_onboarding': typeof WithonboardingRouteRouteWithChildren
  '/onboarding': typeof OnboardingRouteRoute
  '/_with_onboarding/dashboard': typeof WithonboardingDashboardRouteRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '' | '/onboarding' | '/dashboard'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '' | '/onboarding' | '/dashboard'
  id:
    | '__root__'
    | '/'
    | '/_with_onboarding'
    | '/onboarding'
    | '/_with_onboarding/dashboard'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  WithonboardingRouteRoute: typeof WithonboardingRouteRouteWithChildren
  OnboardingRouteRoute: typeof OnboardingRouteRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  WithonboardingRouteRoute: WithonboardingRouteRouteWithChildren,
  OnboardingRouteRoute: OnboardingRouteRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_with_onboarding",
        "/onboarding"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_with_onboarding": {
      "filePath": "_with_onboarding/route.tsx",
      "children": [
        "/_with_onboarding/dashboard"
      ]
    },
    "/onboarding": {
      "filePath": "onboarding/route.tsx"
    },
    "/_with_onboarding/dashboard": {
      "filePath": "_with_onboarding/dashboard/route.tsx",
      "parent": "/_with_onboarding"
    }
  }
}
ROUTE_MANIFEST_END */
