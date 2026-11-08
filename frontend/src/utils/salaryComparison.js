export function prepareSalaryComparison(occupations = []) {
  if (!Array.isArray(occupations)) return [];

  return occupations
    .map((occupation) => {
      const wage = occupation.wages?.find(
        (item) => Number(item.year) === 2025 && String(item.area_code) === '99'
      );

      if (
        wage?.annual_median === null ||
        wage?.annual_median === undefined ||
        wage?.annual_median === ''
      ) {
        return null;
      }

      const salary = Number(wage.annual_median);

      if (!Number.isFinite(salary) || salary <= 0) {
        return null;
      }

      return {
        code: occupation.code,
        title: occupation.title,
        salary,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.salary - a.salary);
}
