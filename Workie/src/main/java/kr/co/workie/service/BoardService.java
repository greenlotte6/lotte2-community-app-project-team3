package kr.co.workie.service;

import kr.co.workie.dto.BoardDTO;
import kr.co.workie.entity.Board;
import kr.co.workie.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class BoardService {
    private final ModelMapper modelMapper;
    private final BoardRepository boardRepository;

    public int addArticle(String loginId, BoardDTO boardDTO) {
        Board board = modelMapper.map(boardDTO, Board.class);
        board.setWriter(loginId);

        Board savedBoard = boardRepository.save(board);

        log.info("Saved Board : {}", savedBoard);

        return savedBoard.getAno();
    }

    public List<BoardDTO> getBoardsByCategory(String category) {
        Pageable pageable = PageRequest.of(0, 10);
        List<Board> boardList = boardRepository.findByCategory(category, pageable);
        return boardList.stream()
                .map(board -> modelMapper.map(board, BoardDTO.class))
                .collect(Collectors.toList());
    }

    public void deleteArticle(int ano) {
        boardRepository.deleteById(ano);
    }

    public BoardDTO findById(int ano) {
        boardRepository.findById(ano);

        return modelMapper.map(boardRepository.findById(ano), BoardDTO.class);

    }

    public void updateArticle(int ano, BoardDTO boardDTO) {
        Board board = boardRepository.findById(ano).orElseThrow();

        String originalWriter = board.getWriter();

        modelMapper.map(boardDTO, board);
        board.setWriter(originalWriter);

        boardRepository.save(board);
    }

    public int pinnedArticle(int ano, boolean pinned) {
        // isPinned가 true로 요청되면, 고정된 게시물이 2개 이상인지 체크
        if (pinned) {
            int pinnedCount = boardRepository.countByPinnedTrue();
            if (pinnedCount >= 2) {
                throw new IllegalStateException("게시물은 최대 2개까지만 고정할 수 있습니다.");
            }
        }

        Board board = boardRepository.findById(ano).orElseThrow();
        board.setPinned(pinned);
        boardRepository.save(board);

        return ano;
    }

    public List<BoardDTO> getNotices(String notice) {
        Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Order.desc("wDate")));
        List<Board> boardList = boardRepository.findByCategory(notice, pageable);

        return boardList.stream()
                .map(board -> modelMapper.map(board, BoardDTO.class))
                .collect(Collectors.toList());
    }

    public List<BoardDTO> getPinnedNotices(boolean pinned) {
        // isPinned == true 인 게시물만 필터링
        List<Board> boardList = boardRepository.findByPinned(pinned);

        return boardList.stream()
                .map(board -> modelMapper.map(board, BoardDTO.class))
                .collect(Collectors.toList());
    }

    public List<BoardDTO> getFrees(String free) {
        Pageable pageable = PageRequest.of(0, 3, Sort.by(Sort.Order.desc("wDate")));
        List<Board> boardList = boardRepository.findByCategory(free, pageable);

        return boardList.stream()
                .map(board -> modelMapper.map(board, BoardDTO.class))
                .collect(Collectors.toList());
    }

    public List<BoardDTO> getMenus(String menu) {
        Pageable pageable = PageRequest.of(0, 3, Sort.by(Sort.Order.desc("wDate")));
        List<Board> boardList = boardRepository.findByCategory(menu, pageable);

        return boardList.stream()
                .map(board -> modelMapper.map(board, BoardDTO.class))
                .collect(Collectors.toList());
    }

    public List<BoardDTO> getRecent() {
        Pageable pageable = PageRequest.of(0, 3, Sort.by(Sort.Order.desc("wDate")));

        Page<Board> boardList = boardRepository.findAll(pageable);

        return boardList.getContent().stream()
                .map(board -> modelMapper.map(board, BoardDTO.class))
                .collect(Collectors.toList());
    }
}