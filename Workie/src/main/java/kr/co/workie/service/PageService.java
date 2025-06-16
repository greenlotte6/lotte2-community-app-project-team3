package kr.co.workie.service;

import kr.co.workie.dto.PageDTO;
import kr.co.workie.entity.Page;
import kr.co.workie.repository.PageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class PageService {

    private final ModelMapper modelMapper;
    private final PageRepository pageRepository;

    public int addPage(String loginId, PageDTO pageDTO) {
        Page page = modelMapper.map(pageDTO, Page.class);
        page.setWriter(loginId);

        Page savedPage = pageRepository.save(page);

        return savedPage.getPno();
    }

    public void addMember(){}

    public void updatePage(int pno, PageDTO pageDTO) {
        Page page = pageRepository.findById(pno).orElseThrow();

        //기존의 writer 유지
        String originalWriter = page.getWriter();

        modelMapper.map(pageDTO, page);

        page.setWriter(originalWriter);
        page.setModDate(LocalDateTime.now());

        pageRepository.save(page);
    }

    public void deletePage(){}

    public List<Page> getPageByWriter(String loginId) {
        List<Page> pageList = pageRepository.findAllByWriter(loginId);
        return pageList.stream()
                .map(page -> modelMapper.map(page, Page.class))
                .collect(Collectors.toList());
    }

    public int addFavorite(int pno, boolean favorite) {
        Page page = pageRepository.findById(pno).orElseThrow();
        page.setFavorite(favorite);
        pageRepository.save(page);
        return pno;
    }

    public PageDTO findPage(int pno) {
        Page page = pageRepository.findById(pno).orElseThrow();
        return modelMapper.map(page, PageDTO.class);
    }


    public int countPagesByWriter(String id) {
        int pageCount = pageRepository.countByWriter(id); // 수정된 Repository 메서드 호출
        log.info("💡 Writer {} has {} pages.", id, pageCount); // 로그 추가 (선택 사항)
        return pageCount;
    }

    public List<PageDTO> getRecentPages(String loginId) {
        return pageRepository.findTop3ByWriterOrderByModDateDesc(loginId)
                .stream().map(p -> modelMapper.map(p, PageDTO.class))
                .collect(Collectors.toList());
    }

    public List<Page> getPagesByParent(String loginId) {
        return pageRepository.findByWriterAndParentPage(loginId, 0);
    }

}
