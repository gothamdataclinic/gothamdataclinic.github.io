import { AdminNav as AdminNav_a202ad21aea188adfad41087711ba85c } from '@/components/AdminNav'
import { LogoutButton as LogoutButton_db9ac62598c46d0f1db201f6af05442e } from '@/components/LogoutButton'
import { LoginLogo as LoginLogo_23cade6f0f915ee2a7bd9bceb0c04941 } from '@/components/LoginLogo'
import { GoogleSignInButton as GoogleSignInButton_c854179ca65623942c9855ce6110ba72 } from '@/components/GoogleSignInButton'
import { S3ClientUploadHandler as S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24 } from '@payloadcms/storage-s3/client'
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'

/** @type import('payload').ImportMap */
export const importMap = {
  "@/components/AdminNav#AdminNav": AdminNav_a202ad21aea188adfad41087711ba85c,
  "@/components/LogoutButton#LogoutButton": LogoutButton_db9ac62598c46d0f1db201f6af05442e,
  "@/components/LoginLogo#LoginLogo": LoginLogo_23cade6f0f915ee2a7bd9bceb0c04941,
  "@/components/GoogleSignInButton#GoogleSignInButton": GoogleSignInButton_c854179ca65623942c9855ce6110ba72,
  "@payloadcms/storage-s3/client#S3ClientUploadHandler": S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1
}
