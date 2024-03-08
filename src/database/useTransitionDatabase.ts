import { useSQLiteContext } from "expo-sqlite/next";

type TransactionCreateDatabase = {
  amount: number;
  goalId: number;
};

type TransactionResponseDatabase = {
  id: string;
  amount: number;
  goal_id: number;
  created_at: number;
};

export function useTransactionDatabase() {
  const database = useSQLiteContext();

  function create({ amount, goalId }: TransactionCreateDatabase) {
    try {
      const statement = database.prepareSync(
        `INSERT INTO transactions (amount, goal_id) VALUES ($amount, $goal_id)`
      );

      statement.executeSync({
        $amount: amount,
        $goal_id: goalId,
      });
    } catch (error) {
      throw error;
    }
  }

  function findLatest() {
    try {
      return database.getAllSync<TransactionResponseDatabase>(
        `SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10`
      );
    } catch (error) {
      throw error;
    }
  }

  function findByGoal(goalId: number) {
    try {
      const statement = database.prepareSync(
        `SELECT * FROM transactions WHERE goal_id = $goal_id`
      );

      const result = statement.executeSync<TransactionResponseDatabase>({
        $goal_id: goalId,
      });

      return result.getAllSync();
    } catch (error) {
      throw error;
    }
  }

  return {
    create,
    findLatest,
    findByGoal,
  };
}
