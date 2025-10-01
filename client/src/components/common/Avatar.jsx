// src/components/common/Avatar.jsx
import React, { useState } from 'react'

const SIZE_MAP = {
  sm: { wrap: 'w-8 h-8', text: 'text-xs' },
  md: { wrap: 'w-10 h-10', text: 'text-sm' },
  lg: { wrap: 'w-24 h-24', text: 'text-2xl' }
}

/**
 * Avatar component
 *
 * Props:
 * - src: direct image URL (takes highest precedence)
 * - user: optional user/company object (will try common fields: avatar, avatarUrl, profileImage, profilePic, image, picture)
 * - name: fallback name if user not provided
 * - size: 'sm'|'md'|'lg' or a number (pixels)
 * - className: extra classes for wrapper/img
 * - alt: alt text
 */
const Avatar = ({ src, user, name = '', size = 'md', className = '', alt = '' }) => {
  const [errored, setErrored] = useState(false)

  // Resolve image URL from props.user or src
  const resolveFromUser = (u) => {
    if (!u) return null

    // common fields that might hold the image URL (handle nested objects too)
    const candidates = [
      'avatar',
      'avatarUrl',
      'profileImage',
      'profilePic',
      'image',
      'picture',
      'photo',
      'avatar_url' // snake_case variants
    ]

    for (const key of candidates) {
      const val = u[key]
      if (!val) continue
      if (typeof val === 'string' && val.trim()) return val
      if (typeof val === 'object') {
        // some code stores { url: '...' } or { secure_url: '...' }
        const maybeUrl = val.url || val.secure_url || val.src
        if (maybeUrl) return maybeUrl
      }
    }

    // Some responses nest image under e.g. user.profile.avatar.url
    // Try a couple common nested shapes
    if (u.profile && typeof u.profile === 'object') {
      const nested = u.profile.avatar || u.profile.image
      if (nested) {
        if (typeof nested === 'string') return nested
        if (nested.url) return nested.url
      }
    }

    return null
  }

  const imageSrc = src || resolveFromUser(user) || null
  const resolvedName = (name || (user && (user.name || user.companyName || user.fullName)) || '').trim()

  // compute initials
  const initials = resolvedName
    ? resolvedName
        .split(' ')
        .map(n => (n ? n[0] : ''))
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  // handle numeric size (px) or string sizes
  const isNumberSize = typeof size === 'number'
  const sizeStyle = isNumberSize ? { width: size, height: size, fontSize: Math.floor(size / 2.8) } : {}
  const { wrap = 'w-10 h-10', text = 'text-sm' } = (!isNumberSize && SIZE_MAP[size]) ? SIZE_MAP[size] : SIZE_MAP.md

  // If image exists and hasn't errored, show <img>
  if (imageSrc && !errored) {
    return (
      <img
        src={imageSrc}
        alt={alt || resolvedName || 'avatar'}
        onError={() => setErrored(true)}
        className={`${!isNumberSize ? wrap : ''} rounded-full object-cover border ${className}`}
        style={sizeStyle}
      />
    )
  }

  // fallback avatar (initials)
  return (
    <div
      aria-hidden="true"
      className={`${!isNumberSize ? wrap : ''} rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold ${text} ${className}`}
      style={sizeStyle}
    >
      {initials}
    </div>
  )
}

export default Avatar
