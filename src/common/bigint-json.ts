/**
 * Prisma devuelve los id de PostgreSQL del tipo bigint como BigInt, y
 * JSON.stringify no sabe serializarlos (lanza "Do not know how to serialize a
 * BigInt"). Los exponemos como string para no perder precision.
 */
(BigInt.prototype as unknown as { toJSON: () => string }).toJSON =
  function (this: bigint) {
    return this.toString();
  };
