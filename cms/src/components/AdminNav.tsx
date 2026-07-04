import React, { cache } from 'react'
import { Logout } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { DefaultNavClient, NavHamburger, NavWrapper } from '@payloadcms/next/client'
import { EntityType, groupNavItems } from '@payloadcms/ui/shared'
import { PREFERENCE_KEYS } from 'payload/shared'
import type { NavPreferences, PayloadRequest, ServerProps } from 'payload'

// `NavProps` itself isn't part of @payloadcms/next's public exports —
// reconstruct the same shape (it's just ServerProps + an optional req).
type NavProps = { req?: PayloadRequest } & ServerProps

// Payload's built-in sidebar always lists every Collection before every
// Global within a group (see groupNavItems in @payloadcms/ui) — there's no
// config option to interleave them, so the "Pages" group would always show
// Events/Publications (collections) before Home/About/Donate/Tax & Legal
// (globals) regardless of array order in payload.config.ts.
//
// This override builds the "Pages" group by hand in the exact route order
// the website uses, then falls back to Payload's normal grouping for
// everything else (Content, Admin, Site-wide). DefaultNavClient/NavWrapper/
// NavHamburger/Logout are the same components Payload's own DefaultNav uses
// — only the *ordering* is custom.
const PAGES_GROUP_ORDER: { slug: string; type: EntityType }[] = [
  { slug: 'home', type: EntityType.global },
  { slug: 'about', type: EntityType.global },
  { slug: 'events', type: EntityType.collection },
  { slug: 'publications', type: EntityType.collection },
  { slug: 'donate', type: EntityType.global },
  { slug: 'tax-info', type: EntityType.global },
]

const getNavPrefs = cache(async (req: NavProps['req']) => {
  return req?.user?.collection
    ? await req.payload
        .find({
          collection: 'payload-preferences',
          depth: 0,
          limit: 1,
          pagination: false,
          req,
          where: {
            and: [
              { key: { equals: PREFERENCE_KEYS.NAV } },
              { 'user.relationTo': { equals: req.user.collection } },
              { 'user.value': { equals: req?.user?.id } },
            ],
          },
        })
        ?.then((res) => res?.docs?.[0]?.value)
    : null
})

export const AdminNav: React.FC<NavProps> = async (props) => {
  const { i18n, payload, permissions, req, user, viewType, documentSubViewType, locale, params, searchParams } = props

  if (!payload?.config || !permissions) return null

  const {
    admin: {
      components: { afterNav, afterNavLinks, beforeNav, beforeNavLinks, logout },
    },
    collections,
    globals,
  } = payload.config

  const visibleEntities = props.visibleEntities

  const visibleCollections = collections.filter(({ slug }) => visibleEntities?.collections.includes(slug))
  const visibleGlobals = globals.filter(({ slug }) => visibleEntities?.globals.includes(slug))

  const orderedPagesEntities = PAGES_GROUP_ORDER.map(({ slug, type }) => {
    const entity =
      type === EntityType.collection
        ? visibleCollections.find((c) => c.slug === slug)
        : visibleGlobals.find((g) => g.slug === slug)
    return entity ? { entity, type } : null
  }).filter((e): e is NonNullable<typeof e> => e !== null)

  const pagesSlugs = new Set(PAGES_GROUP_ORDER.map((e) => e.slug))
  const remainingCollections = visibleCollections.filter((c) => !pagesSlugs.has(c.slug))
  const remainingGlobals = visibleGlobals.filter((g) => !pagesSlugs.has(g.slug))

  const pagesGroup = groupNavItems(
    orderedPagesEntities.map(({ entity, type }) => ({ entity, type }) as any),
    permissions,
    i18n,
  ).map((group) => ({ ...group, label: 'Pages' }))

  const remainingGroups = groupNavItems(
    [
      ...remainingCollections.map((entity) => ({ type: EntityType.collection, entity }) as any),
      ...remainingGlobals.map((entity) => ({ type: EntityType.global, entity }) as any),
    ],
    permissions,
    i18n,
  )

  const groups = [...pagesGroup, ...remainingGroups]

  const navPreferences = (await getNavPrefs(req)) as NavPreferences

  const serverProps = { i18n, locale, params, payload, permissions, searchParams, user }

  const LogoutComponent = RenderServerComponent({
    clientProps: { documentSubViewType, viewType },
    Component: logout?.Button,
    Fallback: Logout,
    importMap: payload.importMap,
    serverProps,
  })

  const RenderedBeforeNav = RenderServerComponent({ clientProps: { documentSubViewType, viewType }, Component: beforeNav, importMap: payload.importMap, serverProps })
  const RenderedBeforeNavLinks = RenderServerComponent({ clientProps: { documentSubViewType, viewType }, Component: beforeNavLinks, importMap: payload.importMap, serverProps })
  const RenderedAfterNavLinks = RenderServerComponent({ clientProps: { documentSubViewType, viewType }, Component: afterNavLinks, importMap: payload.importMap, serverProps })
  const RenderedAfterNav = RenderServerComponent({ clientProps: { documentSubViewType, viewType }, Component: afterNav, importMap: payload.importMap, serverProps })

  return (
    <NavWrapper baseClass="nav">
      {RenderedBeforeNav}
      <nav className="nav__wrap">
        {RenderedBeforeNavLinks}
        <DefaultNavClient groups={groups} navPreferences={navPreferences} />
        {RenderedAfterNavLinks}
        <div className="nav__controls">{LogoutComponent}</div>
      </nav>
      {RenderedAfterNav}
      <div className="nav__header">
        <div className="nav__header-content">
          <NavHamburger baseClass="nav" />
        </div>
      </div>
    </NavWrapper>
  )
}
