#ifndef UTILS_H
#define UTILS_H

#include <vector>

#include "Config.h"
#include "Graph.h"
#include "Search.h"

/**
 *  The fact (lemur, have, tail)
 */
const vector<word> lemursHaveTails();

/**
 *  The fact (animal, have, tail)
 */
const vector<word> animalsHaveTails();

/**
 *  The fact (cat, have, tail)
 */
const vector<word> catsHaveTails();

/**
 * Print the string gloss for the given fact.
 */
string toString(Graph& graph, const word* fact, const uint8_t factSize);

/**
 * Print a human readable dump of a search path.
 */
string toString(Graph& graph, SearchType& searchType, const Path* path);

#endif