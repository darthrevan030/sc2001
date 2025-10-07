#include <iostream>
#include <vector>
#include <ctime>
#include <algorithm>
#include <chrono>

// sorting functions
void insertionSort(std::vector<int> &arr);                   // to be tested
void mergeSort(std::vector<int> &arr, int n, int m);         // to be tested
void merge(std::vector<int> &arr, int n, int m);             // to be tested
void hybridSort(std::vector<int> &arr, int m, int n, int S); // to be tested

// arr generation
std::vector<int> generateArr(int size, int max); // works
void printArr(std::vector<int> &arr, int size);  // works

// comparison counter
int compare(int a, int b); // works

// global int for counting comparisons
static int comparisons = 0;

/* TODO:
    1. combine merge-insertion sort
    2. implement specified changed from pdf
    3. test functionality
    4. goon (most important)
*/

int main()
{

    // initialization of variables
    int size, max, S;
    max = 10000000;

    std::cout << "Enter size of data (max 10e7): ";
    std::cin >> size;
    if (size > max)
    {
        std::cout << "Error: Exceeded Maxmimum Size Limit" << '\n';
        return 1;
    }
    std::cout << "Threshold value: ";
    std::cin >> S;

    // generation of random array
    srand(time(NULL));
    std::vector<int> testData = generateArr(size, max);
    std::cout << '\n';
    printArr(testData, size);
    std::cout << '\n';

    // sorting begins here:
    auto start = std::chrono::high_resolution_clock::now();

    hybridSort(testData, 0, testData.size() - 1, S);

    std::cout << '\n';
    printArr(testData, size);
    std::cout << '\n';

    auto end = std::chrono::high_resolution_clock::now();

    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);

    double time_taken = duration.count();

    std::cout << "Time taken: " << time_taken << " microseconds" << '\n';
    std::cout << "Number of comparisons: " << comparisons << '\n';

    return 0;
}

////////// ARRAY GENERATION ///////////////////

void printArr(std::vector<int> &arr, int size)
{
    for (int i = 0; i < size; i++)
    {
        std::cout << arr[i] << '\n';
    }
}

std::vector<int> generateArr(int size, int max)
{
    std::vector<int> randArr(size);
    for (int i = 0; i < size; i++)
    {
        randArr[i] = rand() % max + 1;
    }

    return randArr;
}

int compare(int a, int b)
{
    comparisons++;
    if (a > b)
        return 1;
    else if (a < b)
        return -1;
    else
        return 0;
}

///////////// SORTING PORTION //////////////////

void hybridSort(std::vector<int> &arr, int n, int m, int S)
{
    int mid = (n + m) / 2; // midpoint

    if (m - n <= 0)
        return; // if empty
    else if (m - n > S)
    {
        hybridSort(arr, n, mid, S);     // hybridSort(lefthalf)
        hybridSort(arr, mid + 1, m, S); // hybridSort(righthalf)
        merge(arr, n, m);               // both arrays
    }
    else
    {
        insertionSort(arr);
    }
}

void insertionSort(std::vector<int> &arr)
{
    // TODO
    for (int i = 1; i < arr.size(); i++)
    {
        for (int j = i; j > 0; j--)
        {
            if (arr[j] < arr[j - 1])
            {
                std::swap(arr[j], arr[j - 1]);
            }
            else
                break;
        }
    }
}

void mergeSort(std::vector<int> &arr, int n, int m)
{
    // TODO
    int mid = (m + n) / 2;

    if (m - n <= 0)
        return;
    else
    {
        mergeSort(arr, n, mid);
        mergeSort(arr, mid + 1, m);
        merge(arr, n, m);
    }

    // mergeSort(leftArr);
    // mergeSort(rightArr);
    // merge(leftArr, rightArr, arr);
}

void merge(std::vector<int> &arr, int n, int m)
{
    int mid = (m + n) / 2;

    int a = n;
    int b = mid + 1;
    int temp;

    if (m - n <= 0)
        return;
    while (a <= mid && b <= m)
    {
        int comp = compare(arr[a], arr[b]);
        if (comp > 0)
        {
            temp = arr[b++];
            for (int i = ++mid; i > a; i--)
            {
                arr[i] = arr[i - 1];
            }
            arr[a++] = temp;
        }
        else if (comp < 0)
        {
            a++;
        }
        else
        {
            if (a == mid && b == m)
                break;

            temp = arr[b++];
            a++;

            for (int i = ++mid; i > a; i--)
            {
                arr[i] = arr[i - 1];
            }
            arr[a++] = temp;
        }
    }
}