const calculateMatchingScore = (user, ad) => {
  try {
    let score = 0;
    const commonInterests = user.interests.filter((interest) =>
      ad.targetAudience.tags.includes(interest)
    );
    const checkAge = ad.targetAudience.ageGroups.some((group) => {
      const [min, max] = group.split("-").map(Number);
      return user.age >= min && user.age <= max;
    });
    const checkGeolocation = ad.targetAudience.geolocations.includes(
      user.location
    );
    score += commonInterests.length * 2;

    if (checkAge && checkGeolocation) {
      score += 6;
    } else if (checkAge && !checkGeolocation) {
      score += 3;
    } else if (!checkAge && checkGeolocation) {
      score += 2;
    }

    return score;
  } catch (error) {
    console.error("Error occurred while calculating matching score", error);
  }
};

export const getMatchingScores = async (user, contents, contentType) => {
  const matchingScores = [];
  for (const content of contents) {
    const matchingScore = calculateMatchingScore(user, content);
    matchingScores.push({ [`${contentType}Id`]: content._id, score: matchingScore });
  }
  matchingScores.sort((a, b) => b.score - a.score);
  return matchingScores;
};
