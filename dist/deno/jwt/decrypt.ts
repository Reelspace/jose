import { compactDecrypt } from '../jwe/compact/decrypt.ts'
import type {
  KeyLike,
  DecryptOptions,
  JWTClaimVerificationOptions,
  GetKeyFunction,
  CompactJWEHeaderParameters,
  FlattenedJWE,
  JWTDecryptResult,
  ResolvedKey,
} from '../types.d.ts'
import jwtPayload from '../lib/jwt_claims_set.ts'
import { JWTClaimValidationFailed } from '../util/errors.ts'

/** Combination of JWE Decryption options and JWT Claims Set verification options. */
export interface JWTDecryptOptions extends DecryptOptions, JWTClaimVerificationOptions {}

/**
 * Interface for JWT Decryption dynamic key resolution. No token components have been verified at
 * the time of this function call.
 */
export interface JWTDecryptGetKey
  extends GetKeyFunction<CompactJWEHeaderParameters, FlattenedJWE> {}

/**
 * Verifies the JWT format (to be a JWE Compact format), decrypts the ciphertext, validates the JWT
 * Claims Set.
 *
 * @param jwt JSON Web Token value (encoded as JWE).
 * @param key Private Key or Secret to decrypt and verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export async function jwtDecrypt(
  jwt: string | Uint8Array,
  key: KeyLike | Uint8Array,
  options?: JWTDecryptOptions,
): Promise<JWTDecryptResult>
/**
 * @param jwt JSON Web Token value (encoded as JWE).
 * @param getKey Function resolving Private Key or Secret to decrypt and verify the JWT with. See
 *   {@link https://github.com/panva/jose/issues/210#jwe-alg Algorithm Key Requirements}.
 * @param options JWT Decryption and JWT Claims Set validation options.
 */
export async function jwtDecrypt<T extends KeyLike = KeyLike>(
  jwt: string | Uint8Array,
  getKey: JWTDecryptGetKey,
  options?: JWTDecryptOptions,
): Promise<JWTDecryptResult & ResolvedKey<T>>
export async function jwtDecrypt(
  jwt: string | Uint8Array,
  key: KeyLike | Uint8Array | JWTDecryptGetKey,
  options?: JWTDecryptOptions,
) {
  const decrypted = await compactDecrypt(jwt, <Parameters<typeof compactDecrypt>[1]>key, options)
  const payload = jwtPayload(decrypted.protectedHeader, decrypted.plaintext, options)

  const { protectedHeader } = decrypted

  if (protectedHeader.iss !== undefined && protectedHeader.iss !== payload.iss) {
    throw new JWTClaimValidationFailed(
      'replicated "iss" claim header parameter mismatch',
      'iss',
      'mismatch',
    )
  }

  if (protectedHeader.sub !== undefined && protectedHeader.sub !== payload.sub) {
    throw new JWTClaimValidationFailed(
      'replicated "sub" claim header parameter mismatch',
      'sub',
      'mismatch',
    )
  }

  if (
    protectedHeader.aud !== undefined &&
    JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud)
  ) {
    throw new JWTClaimValidationFailed(
      'replicated "aud" claim header parameter mismatch',
      'aud',
      'mismatch',
    )
  }

  const result = { payload, protectedHeader }

  if (typeof key === 'function') {
    return { ...result, key: decrypted.key }
  }

  return result
}
