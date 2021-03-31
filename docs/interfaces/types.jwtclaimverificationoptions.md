# Interface: JWTClaimVerificationOptions

[types](../modules/types.md).JWTClaimVerificationOptions

JWT Claims Set verification options.

## Hierarchy

* **JWTClaimVerificationOptions**

  ↳ [*JWTDecryptOptions*](jwt_decrypt.jwtdecryptoptions.md)

  ↳ [*JWTVerifyOptions*](jwt_verify.jwtverifyoptions.md)

## Table of contents

### Properties

- [audience](types.jwtclaimverificationoptions.md#audience)
- [clockTolerance](types.jwtclaimverificationoptions.md#clocktolerance)
- [currentDate](types.jwtclaimverificationoptions.md#currentdate)
- [issuer](types.jwtclaimverificationoptions.md#issuer)
- [maxTokenAge](types.jwtclaimverificationoptions.md#maxtokenage)
- [subject](types.jwtclaimverificationoptions.md#subject)
- [typ](types.jwtclaimverificationoptions.md#typ)

## Properties

### audience

• `Optional` **audience**: *string* \| *string*[]

Expected JWT "aud" (Audience) Claim value(s).

Defined in: [types.d.ts:428](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L428)

___

### clockTolerance

• `Optional` **clockTolerance**: *string* \| *number*

Expected clock tolerance
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

Defined in: [types.d.ts:435](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L435)

___

### currentDate

• `Optional` **currentDate**: Date

Date to use when comparing NumericDate claims, defaults to `new Date()`.

Defined in: [types.d.ts:462](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L462)

___

### issuer

• `Optional` **issuer**: *string* \| *string*[]

Expected JWT "iss" (Issuer) Claim value(s).

Defined in: [types.d.ts:440](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L440)

___

### maxTokenAge

• `Optional` **maxTokenAge**: *string* \| *number*

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.
- in seconds when number (e.g. 5)
- parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

Defined in: [types.d.ts:447](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L447)

___

### subject

• `Optional` **subject**: *string*

Expected JWT "sub" (Subject) Claim value.

Defined in: [types.d.ts:452](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L452)

___

### typ

• `Optional` **typ**: *string*

Expected JWT "typ" (Type) Header Parameter value.

Defined in: [types.d.ts:457](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L457)