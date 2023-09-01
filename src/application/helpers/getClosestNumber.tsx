const getClosestNumber = (counts: any | undefined | null, goal: number | undefined | null): number | null => {
  const closest = counts.reduce(function(prev, curr) {
    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev)
  })

  return closest
}

export default getClosestNumber
